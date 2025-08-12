"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import ApplicationsGrid from "@/components/dashboard/ApplicationsGrid";

export default function ApplicationsPage() {
  return (
    <div className="mx-auto max-w-6xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Applications</h1>
          <p className="text-sm text-muted-foreground">Track your application progress and essay completion.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard" className="btn btn-outline text-xs">Back to Dashboard</Link>
          <Link href="/dashboard/applications/new" className="btn btn-primary text-xs">Add Application</Link>
        </div>
      </div>

      <ApplicationsGrid />
    </div>
  );
} 