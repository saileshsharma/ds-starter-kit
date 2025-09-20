// Page: EnhancedDashboard
// Title: Enhanced Dashboard
// Description: A comprehensive dashboard with data integration and advanced components
// Route: /dashboard

import React from "react";
import { Card } from "@your-ds/react";
import { Stack } from "@your-ds/react";
import { DataTable } from "@your-ds/react";
import { Stat } from "@your-ds/react";
import { Text } from "@your-ds/react";
import { Badge } from "@your-ds/react";
import { Button } from "@your-ds/react";
import { useRestQuery, useGraphQLQuery } from "@your-ds/data";

export default function EnhancedDashboard() {
  return (
    <>
      <Card
        title={"Performance Metrics"}
        subtitle={"Real-time business indicators"}
        shadow={"md"}
      >
        <Stack spacing={"4"} align={"stretch"}>
          <DataTable
            columns={[
              { key: "metric", header: "Metric" },
              { key: "value", header: "Current Value" },
              { key: "change", header: "Change" },
              { key: "trend", header: "Trend" },
            ]}
            dataSource={useRestQuery("/api/metrics", { period: "today" })}
            sortable={true}
            pagination={false}
          />
        </Stack>
      </Card>

      <Card title={"Quick Stats"} shadow={"md"}>
        <Stack spacing={"3"}>
          <Stat
            label={"Total Revenue"}
            value={revenueData.total}
            trend={"up"}
            change={"+12.5%"}
          />
          <Stat
            label={"Active Users"}
            value={userData.active}
            trend={"up"}
            change={"+5.2%"}
          />
          <Stat
            label={"Conversion Rate"}
            value={conversionData.rate}
            trend={"neutral"}
            change={"0.1%"}
          />
        </Stack>
      </Card>

      <Card title={"Recent User Activity"} shadow={"md"}>
        <DataTable
          columns={[
            { key: "user", header: "User" },
            { key: "action", header: "Action" },
            { key: "timestamp", header: "Time" },
            { key: "status", header: "Status" },
          ]}
          dataSource={useGraphQLQuery("GET_USER_ACTIVITY", {
            limit: 10,
            orderBy: "timestamp",
          })}
          pagination={true}
          loading={true}
        />
      </Card>

      <Card title={"System Health"} shadow={"md"}>
        <Stack spacing={"4"}>
          <Stack spacing={"2"}>
            <Text size={"sm"} weight={"medium"}>
              {"Service Status"}
            </Text>
            <Badge variant={"success"}>{"All Systems Operational"}</Badge>
          </Stack>
          <Stack spacing={"2"}>
            <Stat
              label={"Response Time"}
              value={"{{systemData.responseTime}}ms"}
            />
            <Stat label={"Uptime"} value={systemData.uptime} />
          </Stack>
        </Stack>
      </Card>

      <Card title={"Quick Actions"} shadow={"sm"}>
        <Stack spacing={"4"}>
          <Button variant={"primary"} size={"md"}>
            Generate Report
          </Button>
          <Button variant={"secondary"} size={"md"}>
            Export Data
          </Button>
          <Button variant={"outline"} size={"md"}>
            Configure Dashboard
          </Button>
        </Stack>
      </Card>
    </>
  );
}
