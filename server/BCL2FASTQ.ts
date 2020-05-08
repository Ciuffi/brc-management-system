import DbHandler from "./DBHandler";
import child_process from "child_process";
import Run from "./models/Run";
import { greenLog, redLog, yellowLog } from "./Logging";

const createProcessString = ({ BCLFolderPath, SampleSheetPath }: Run) => {
  let program =
    "/brcwork/sequence/BRC_pipelines/BRC_RNAseq_pipeline/autorun_rnaseq";
  return `${program} run -r ${BCLFolderPath} -s ${SampleSheetPath}`;
};

export default async (id: string, db: DbHandler) => {
  const Run = await db.GetRunByID(id);
  if (!Run.SampleSheetPath) {
    yellowLog(
      `> No sample sheet provied for: ${Run.RunName} Waiting for upload..`
    );
  }
  const processString = createProcessString(Run);
  console.log(processString);
  await db.updateRun(id, {
    RunStatus: "BeginBCL2FASTQ",
    BCL2FASTQStartedOn: new Date().toISOString()
  });
  let child = child_process.exec(processString);

  child.stdout.on("data", data => {
    console.log(data);
  });
  child.on("exit", async code => {
    if (code === 0) {
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
      redLog(`> BCL2FASTQ failed for ${Run.RunName}`);
    }
  });
};
