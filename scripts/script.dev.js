const { log, runScript } = require("./helpers");

const scriptDev = async () => {
  log("divider");
  log("info", "DEVELOPMENT SERVER STARTING...");
  log("divider");

  await runScript("anvil", {
    start: "Starting anvil...",
    success: "Anvil started successfully.",
    persistent: true,
    isReadyWhen: "Listening on"
  });

  log("divider");

  await runScript(
    `cd contract && forge script script/Deploy.s.sol --rpc-url ${process.env.RPC_URL} --broadcast --private-key ${process.env.DEPLOYER_KEY}`,
    {
      start: "Deploying contracts...",
      success: "Contracts deployed successfully!"
    }
  );

  log("divider");

  await runScript("cd frontend && npm run dev", {
    start: "Starting frontend development server...",
    success: "Frontend development server started successfully!",
    persistent: true,
    isReadyWhen: "expose"
  });

  log("divider");
  log("success", "DEVELOPMENT SERVER STARTED SUCCESSFULLY!");
  log("divider");
};

scriptDev();
