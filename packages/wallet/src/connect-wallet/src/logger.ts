class Logger {
    private logs: string[] = [];
    private subscribers: Array<(logs: string[]) => void> = [];
  
    log(message: string) {
      this.logs.push(message);
      this.notifySubscribers();
    }
  
    subscribe(callback: (logs: string[]) => void) {
      this.subscribers.push(callback);
      // Send the current logs to the new subscriber
      callback(this.logs);
    }
  
    private notifySubscribers() {
      this.subscribers.forEach((callback) => callback(this.logs));
    }
  }
  
  export const logger = new Logger();
  