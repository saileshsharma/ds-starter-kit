import React from "react";
import { Card } from "@your-ds/react";
import { Text } from "@your-ds/react";
import { Button } from "@your-ds/react";

export default function DemoPage() {
  return (
    <>
    <Card title={"AI Generated (Demo)"}>
      <Text size={"md"}>
        {"This component was generated from a prompt in demo mode"}
      </Text>
      <Button variant={"primary"}>
        Click me
      </Button>
    </Card>
    </>
  );
}
