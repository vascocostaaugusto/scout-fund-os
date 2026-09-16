import type { Metadata } from "next";
import { ScoutLogin } from "@/components/portal/scout-login";

export const metadata: Metadata = {
  title: "Scout Portal · Scout Fund OS",
  description: "Sign in to see your own pipeline, allocation, and upside.",
};

export default function PortalLoginPage() {
  return <ScoutLogin />;
}
