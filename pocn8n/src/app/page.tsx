import RealDataFetcher from "@/components/data-fetcher"

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Instagram API - Datos Reales</h1>
          <p className="text-gray-600 mt-2">Conectando con los endpoints de tu workflow de n8n</p>
        </div>
        <RealDataFetcher />
      </div>
    </div>
  )
}
