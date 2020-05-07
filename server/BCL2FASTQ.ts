import DbHandler from "./DBHandler";
import child_process from "child_process";
export default (id: string, db: DbHandler) => {
  const Run = db.GetRunByID(id);
  child_process.exec("").stdio[0];
};
