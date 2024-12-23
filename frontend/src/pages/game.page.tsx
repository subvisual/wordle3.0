import { ConnectButton } from "@rainbow-me/rainbowkit";
import { GameBoard } from "../components/layout/game-board";
import { Container } from "../components/shared/container";

export const GamePage = () => {
  return (
    <Container>
      <ConnectButton />
      <GameBoard />
    </Container>
  );
};
