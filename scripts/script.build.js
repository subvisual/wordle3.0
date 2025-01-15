const { log, runScript } = require("./helpers");

const scriptBuild = async () => {
  log("divider");
  log("info", "BUILDING APP...");
  log("divider");

  await runScript("npm i", {
    start: "Installing general dependencies...",
    success: "General dependencies installed successfully!"
  });

  log("divider");

  await runScript("cd frontend && npm i", {
    start: "Installing frontend dependencies...",
    success: "Frontend dependencies installed successfully!"
  });

  log("divider");

  await runScript("cd contract && forge build", {
    start: "Building contracts...",
    success: "Contracts built successfully!"
  });

  log("divider");

  await runScript("cd frontend && npm run build", {
    start: "Building frontend...",
    success: "Frontend built successfully!"
  });

  log("divider");
  log("success", "APP BUILT SUCCESSFULLY!");
  log("divider");
};

scriptBuild();
