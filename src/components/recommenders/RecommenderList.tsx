type Props = {
  appId: string;
  recommenders: Array<{
    id: string;
    email: string;
    name?: string | null;
    relationship?: string | null;
    status: string;
    recommendation_packets?: Array<{ id: string; last_sent_at: string | null }>;
  }>;
};

export default function RecommenderList({ appId, recommenders }: Props) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Recommenders for Application</h2>
        <div className="text-sm text-muted-foreground">
          {recommenders.length} recommender
          {recommenders.length !== 1 ? "s" : ""}
        </div>
      </div>

      {recommenders.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>No recommenders assigned to this application yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200 dark:border-gray-700">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800">
                <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left text-sm font-medium">
                  Name
                </th>
                <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left text-sm font-medium">
                  Email
                </th>
                <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left text-sm font-medium">
                  Relationship
                </th>
                <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left text-sm font-medium">
                  Status
                </th>
                <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left text-sm font-medium">
                  Last Pack Sent
                </th>
              </tr>
            </thead>
            <tbody>
              {recommenders.map((recommender) => (
                <tr
                  key={recommender.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-sm">
                    {recommender.name || "—"}
                  </td>
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-sm">
                    {recommender.email || "—"}
                  </td>
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-sm">
                    {recommender.relationship || "—"}
                  </td>
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-sm">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        recommender.status === "submitted"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : recommender.status === "drafting"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                      }`}
                    >
                      {recommender.status}
                    </span>
                  </td>
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-sm">
                    {recommender.recommendation_packets?.[0]?.last_sent_at
                      ? new Date(
                          recommender.recommendation_packets[0].last_sent_at,
                        ).toLocaleDateString()
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
