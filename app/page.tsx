import DashBoard from "@/components/Dashboard/DashBoard";
export default function Home() {
  return (
    <main className="flex flex-col md:flex-row min-h-screen items-center justify-between p-16">
      <DashBoard/>
      <div className="w-full h-full border border-red-200 rounded-lg">
        <h1>Hello</h1>
      </div>
    </main>
  );
}
