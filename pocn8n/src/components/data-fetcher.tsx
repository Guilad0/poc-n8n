"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Instagram, AlertCircle, CheckCircle } from "lucide-react"

interface InstagramPost {
  id: string
  caption?: string
  media_url?: string
  permalink: string
  timestamp: string
}

interface InstagramComment {
  id: string
  text: string
  username?: string
  timestamp: string
}

export default function RealDataFetcher() {
  const [accessToken, setAccessToken] = useState("")
  const [posts, setPosts] = useState<InstagramPost[]>([])
  const [comments, setComments] = useState<{ [postId: string]: InstagramComment[] }>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const workflowToken = "IGAATHdwrPHU1BZAE9TNU5GM29Mb1NZARWFOMWZAZAbDFxaDFvckNPNmQ1OHNfZAnlKTFhrWkItc09pSlVRQVQtZAk5FdHJqV3NQcHdFdWo2YjVPbERLUGc0MnF5YAGdlZAzlldG84cXk3LWpWR3pfUFEyUTBZATkRR"

  const fetchInstagramPosts = async () => {
    setLoading(true)
    setError("")
    setSuccess("")
    try {
      const token = accessToken || workflowToken
      const url = `https://graph.instagram.com/me/media?fields=id,caption,media_url,permalink,timestamp&access_token=${token}`
      const response = await fetch(url)
      const data = await response.json()

      if (!response.ok) throw new Error(data.error?.message || "Error al obtener publicaciones")
      setPosts(data.data)
      setSuccess(`Se obtuvieron ${data.data.length} publicaciones`)
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : "Error desconocido"}`)
    } finally {
      setLoading(false)
    }
  }

  const fetchCommentsForPost = async (postId: string) => {
    setLoading(true)
    setError("")
    try {
      const token = accessToken || workflowToken
      const url = `https://graph.instagram.com/${postId}/comments?fields=id,text,username,timestamp&access_token=${token}`
      const response = await fetch(url)
      const data = await response.json()

      if (!response.ok) throw new Error(data.error?.message || "Error al obtener comentarios")

      setComments((prev) => ({
        ...prev,
        [postId]: data.data,
      }))
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : "Error desconocido"}`)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (timestamp: string) =>
    new Date(timestamp).toLocaleString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Instagram className="w-5 h-5" />
            Datos de Instagram API
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Label htmlFor="token">Access Token (opcional)</Label>
          <Input
            id="token"
            type="password"
            placeholder="Tu token de Instagram..."
            value={accessToken}
            onChange={(e) => setAccessToken(e.target.value)}
          />
          <Button onClick={fetchInstagramPosts} disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Instagram className="w-4 h-4 mr-2" />}
            Obtener Publicaciones
          </Button>
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-100 border border-red-200 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 p-3 bg-green-100 border border-green-200 rounded-lg">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>{success}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {posts.length > 0 && (
        <Tabs defaultValue="posts">
          <TabsList>
            <TabsTrigger value="posts">Publicaciones ({posts.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="posts">
            <div className="space-y-4">
              {posts.map((post) => (
                <Card key={post.id}>
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>{post.caption || "Sin descripción"}</span>
                      <Button variant="outline" onClick={() => fetchCommentsForPost(post.id)}>
                        Ver Comentarios
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {post.media_url && (
                      <div className="mb-2">
                        <img src={post.media_url} alt={post.caption} className="w-full rounded-lg" />
                      </div>
                    )}
                    <p className="text-sm text-gray-500">Publicado el {formatDate(post.timestamp)}</p>

                    {comments[post.id] && (
                      <div className="mt-4 space-y-2">
                        <h4 className="font-semibold">Comentarios:</h4>
                        {comments[post.id].map((comment) => (
                          <div key={comment.id} className="border-b pb-2">
                            <p className="font-medium">{comment.username || "usuario_desconocido"}</p>
                            <p className="text-sm text-gray-700">{comment.text}</p>
                            <p className="text-xs text-gray-500">
                              {formatDate(comment.timestamp)}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}