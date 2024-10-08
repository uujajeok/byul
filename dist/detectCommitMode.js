import fs from "fs";
const commitModes = {
    message: (source, sha) => ({ mode: "message", isMessageProvided: true }),
    merge: (source, sha) => ({ mode: "merge", isMessageProvided: true }),
    squash: (source, sha) => ({ mode: "squash", isMessageProvided: true }),
    commit: (source, sha) => ({
        mode: sha ? "amend" : "normal",
        isMessageProvided: false,
    }),
    template: (source, sha) => ({ mode: "template", isMessageProvided: false }),
    default: (source, sha) => ({ mode: "normal", isMessageProvided: false }),
};
function detectCommitMode() {
    const commitMsgFile = process.argv[2];
    const commitSource = process.argv[3];
    const commitSHA = process.argv[4];
    if (!commitMsgFile) {
        console.error("Error: Commit message file not provided.");
        process.exit(1);
    }
    const modeHandler = commitModes[commitSource] || commitModes.default;
    let { mode, isMessageProvided } = modeHandler(commitSource, commitSHA);
    if (!isMessageProvided) {
        const commitMsg = fs.readFileSync(commitMsgFile, "utf-8");
        const nonCommentLines = commitMsg
            .split("\n")
            .filter((line) => !line.startsWith("#") && line.trim() !== "");
        isMessageProvided = nonCommentLines.length > 0;
    }
    return { mode, isMessageProvided };
}
export { detectCommitMode };
