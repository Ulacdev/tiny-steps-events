import { type NextRequest, NextResponse } from "next/server"

// This would normally fetch from the audit trail
// For now, we'll create a reports endpoint that aggregates transaction data
export async function GET(request: NextRequest) {
  try {
    // Fetch audit trail data
    const auditResponse = await fetch(new URL("/api/audit-trail", request.url))
    const auditData = await auditResponse.json()

    const logs = auditData.data || []

    // Calculate statistics
    const stats = {
      totalTransactions: logs.length,
      createCount: logs.filter((log: any) => log.action === "CREATE").length,
      updateCount: logs.filter((log: any) => log.action === "UPDATE").length,
      deleteCount: logs.filter((log: any) => log.action === "DELETE").length,
      archiveCount: logs.filter((log: any) => log.action === "ARCHIVE").length,
      restoreCount: logs.filter((log: any) => log.action === "RESTORE").length,
      loginCount: logs.filter((log: any) => log.action === "LOGIN").length,
    }

    // Group by action type
    const byAction = logs.reduce(
      (acc: any, log: any) => {
        if (!acc[log.action]) {
          acc[log.action] = []
        }
        acc[log.action].push(log)
        return acc
      },
      {} as Record<string, any[]>,
    )

    // Group by entity type
    const byEntity = logs.reduce(
      (acc: any, log: any) => {
        if (!acc[log.entity]) {
          acc[log.entity] = []
        }
        acc[log.entity].push(log)
        return acc
      },
      {} as Record<string, any[]>,
    )

    return NextResponse.json({
      success: true,
      data: {
        transactions: logs,
        stats,
        byAction,
        byEntity,
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to generate report" }, { status: 500 })
  }
}
