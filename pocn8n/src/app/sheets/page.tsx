"use client"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"

interface Persona {
  nombre: string
  edad: string
  ciudad: string
}

export default function Home() {
  const [datos, setDatos] = useState<Persona[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSheets = async () => {
      const sheetId = "1XQJisZPaaKQoUOSJIe7XDNotCV5wh2OPPPqheDwOQgs" 
      const url = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`

      try {
        const response = await fetch(url)
        const text = await response.text()

        const rows = text.split("\n").slice(1) 
        const parsedData: Persona[] = rows
          .filter((row) => row.trim() !== "")
          .map((row) => {
            const [nombre, edad, ciudad] = row.split(",")
            return { nombre, edad, ciudad }
          })

        setDatos(parsedData)
        setLoading(false)
      } catch (error) {
        console.error("Error al obtener datos de Google Sheets:", error)
        setLoading(false)
      }
    }

    fetchSheets()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex space-x-4">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Datos desde Google Sheets</CardTitle>
          <CardDescription>Información obtenida directamente desde la hoja de cálculo</CardDescription>
        </CardHeader>
        <CardContent>
          {datos.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No se encontraron datos</div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="text-sm">
                  {datos.length} {datos.length === 1 ? "registro" : "registros"} encontrados
                </Badge>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold">Nombre</TableHead>
                    <TableHead className="font-semibold">Edad</TableHead>
                    <TableHead className="font-semibold">Ciudad</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {datos.map((persona, index) => (
                    <TableRow key={index} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{persona.nombre}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{persona.edad} años</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{persona.ciudad}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
