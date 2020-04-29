declare namespace Express {
  export interface Request {
    db?: DbHandler;
    dev?: boolean;
    files?: expressFileUpload.FileArray;
  }
}
