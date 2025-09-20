import React from "react";
import { Card } from "@your-ds/react";
import { DataTable } from "@your-ds/react";
import { Stat } from "@your-ds/react";
import { Button } from "@your-ds/react";
import { useGraphQLQuery } from "@your-ds/data";

export default function ClaimsDashboard() {
  return (
    <>
    <Card title={"Open Claims"}>
      <DataTable columns={[{"key":"claimId","header":"Claim #"},{"key":"status","header":"Status"},{"key":"owner","header":"Owner"}]} dataSource={useGraphQLQuery("GET_OPEN_CLAIMS", {})} />
    </Card>

    <Card title={"KPIs"}>
      <Stat label={"Avg Cycle Time"} value={"12.4d"} />
    </Card>

    <Card title={"Actions"}>
      <Button variant={"primary"} size={"md"}>
        Create Claim
      </Button>
    </Card>
    </>
  );
}
