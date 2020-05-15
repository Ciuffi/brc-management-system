import DbHandler from "./DBHandler";
import child_process from "child_process";
import Run from "./models/Run";
import { greenLog, redLog, yellowLog } from "./Logging";
import fs from "fs";

const createProcessString = ({ BCLFolderPath, SampleSheetPath }: Run) => {
  let program =
    "/brcwork/sequence/BRC_pipelines/BRC_RNAseq_pipeline/autorun_rnaseq";
  return `${program} run -r ${BCLFolderPath} -s ${SampleSheetPath}`;
};

const hasError = (log: string) => {
  return log.includes("Exiting because a job execution failed.");
};

export default async (id: string, db: DbHandler) => {
  const Run = await db.GetRunByID(id);
  if (!Run.SampleSheetPath) {
    yellowLog(
      `> No sample sheet provied for: ${Run.RunName} Waiting for upload..`
    );
    return;
  }
  const processString = createProcessString(Run);
  await db.updateRun(id, {
    RunStatus: "BeginBCL2FASTQ",
    BCL2FASTQStartedOn: new Date().toISOString()
  });
  let child = child_process.exec(processString);

  let output = "";
  let error = "";

  child.stdout.on("data", data => (output += data));
  child.stderr.on("data", data => (error += data));
  child.on("exit", async code => {
    if (code === 0 && !hasError(output)) {
      await db.updateRun(id, {
        RunStatus: "EndBCL2FASTQ",
        BCL2FASTQFinishedOn: new Date().toISOString(),
        Error: false
      });
      greenLog(`> Successfuly ran BCL2FAST on ${Run.RunName}`);
    } else {
      await db.updateRun(id, {
        Error: true
      });
      if (!fs.existsSync("./logs")) fs.mkdirSync(`./logs`);
      fs.writeFileSync(`./logs/${Run.RunName}`, output);
      fs.writeFileSync(`./logs/${Run.RunName}-error`, error);
      redLog(`> BCL2FASTQ failed for ${Run.RunName}`);
      yellowLog(`> Log created at logs/${Run.RunName}`);
    }
  });
};
