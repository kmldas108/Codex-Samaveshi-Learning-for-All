import { spawn, ChildProcess } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class McpClient {
  private process: ChildProcess | null = null;
  private nextId = 1;
  private pendingRequests = new Map<
    number,
    {
      resolve: (val: any) => void;
      reject: (err: any) => void;
      timeout: NodeJS.Timeout;
    }
  >();
  private buffer = "";

  constructor() {
    this.start();
  }

  private start() {
    const isProd = process.env.NODE_ENV === "production";
    
    if (isProd) {
      const serverPath = path.resolve(process.cwd(), "dist/regionalContextMcpServer.mjs");
      console.log(`[MCP Client] Starting MCP Server subprocess using node at ${serverPath}`);
      
      this.process = spawn("node", [serverPath], {
        shell: true,
        stdio: ["pipe", "pipe", "pipe"],
      });
    } else {
      const serverPath = path.resolve(process.cwd(), "services/regionalContextMcpServer.ts");
      console.log(`[MCP Client] Starting MCP Server subprocess using tsx at ${serverPath}`);
      
      this.process = spawn("npx", ["tsx", serverPath], {
        shell: true,
        stdio: ["pipe", "pipe", "pipe"],
      });
    }

    if (this.process.stdout) {
      this.process.stdout.on("data", (data) => {
        this.buffer += data.toString();
        this.processBuffer();
      });
    }

    if (this.process.stderr) {
      this.process.stderr.on("data", (data) => {
        console.error(`[MCP Server Stderr]: ${data.toString().trim()}`);
      });
    }

    this.process.on("close", (code) => {
      console.log(`[MCP Server] Process closed with code ${code}`);
      this.rejectAllPending(`MCP Server process closed with code ${code}`);
    });

    this.process.on("error", (err) => {
      console.error(`[MCP Server] Process error:`, err);
      this.rejectAllPending(`MCP Server error: ${err.message}`);
    });
  }

  private processBuffer() {
    let newlineIndex: number;
    while ((newlineIndex = this.buffer.indexOf("\n")) !== -1) {
      const line = this.buffer.substring(0, newlineIndex).trim();
      this.buffer = this.buffer.substring(newlineIndex + 1);
      
      if (line) {
        this.handleMessage(line);
      }
    }
  }

  private handleMessage(line: string) {
    try {
      const response = JSON.parse(line);
      const { id, result, error } = response;
      if (id !== undefined && this.pendingRequests.has(id)) {
        const { resolve, reject, timeout } = this.pendingRequests.get(id)!;
        clearTimeout(timeout);
        this.pendingRequests.delete(id);
        
        if (error) {
          reject(new Error(error.message || "MCP server returned an error"));
        } else {
          resolve(result);
        }
      }
    } catch (err) {
      console.error(`[MCP Client] Failed to parse message line: ${line}`, err);
    }
  }

  private rejectAllPending(reason: string) {
    for (const [id, req] of this.pendingRequests.entries()) {
      clearTimeout(req.timeout);
      req.reject(new Error(reason));
    }
    this.pendingRequests.clear();
  }

  public callTool(name: string, argumentsObj: any): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.process || this.process.killed) {
        // Attempt a restart if process died
        this.start();
        if (!this.process || this.process.killed) {
          return reject(new Error("MCP Server process is not running"));
        }
      }

      const id = this.nextId++;
      const request = {
        jsonrpc: "2.0",
        method: "tools/call",
        params: {
          name,
          arguments: argumentsObj,
        },
        id,
      };

      const timeout = setTimeout(() => {
        if (this.pendingRequests.has(id)) {
          this.pendingRequests.delete(id);
          reject(new Error(`MCP request ${id} timed out`));
        }
      }, 8000); // 8 seconds timeout to account for Windows startup lag

      this.pendingRequests.set(id, { resolve, reject, timeout });

      const requestStr = JSON.stringify(request) + "\n";
      this.process.stdin?.write(requestStr);
    });
  }

  public async getRegionalAnalogy(location: string, concept: string, theme: string): Promise<string> {
    try {
      const result = await this.callTool("get_regional_analogy", { location, concept, theme });
      if (result && result.content && result.content.length > 0) {
        return result.content[0].text;
      }
      throw new Error("No content returned in MCP result");
    } catch (err: any) {
      console.error("[MCP Client] Error calling get_regional_analogy:", err);
      throw err;
    }
  }

  public shutdown() {
    if (this.process) {
      this.process.kill();
      this.process = null;
    }
  }
}

// Export singleton instance
export const mcpClient = new McpClient();
