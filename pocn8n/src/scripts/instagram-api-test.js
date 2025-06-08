// Script para probar los endpoints reales de Instagram API
// Basado en tu workflow de n8n

const ACCESS_TOKEN =
  "IGAATHdwrPHU1BZAE9TNU5GM29Mb1NZARWFOMWZAZAbDFxaDFvckNPNmQ1OHNfZAnlKTFhrWkItc09pSlVRQVQtZAk5FdHJqV3NQcHdFdWo2YjVPbERLUGc0MnF5ZAGdlZAzlldG84cXk3LWpWR3pfUFEyUTBZATkRR"

async function testInstagramAPI() {
  console.log("🔍 Probando endpoints de Instagram API...\n")

  try {
    // 1. Obtener publicaciones (endpoint de tu workflow)
    console.log("📱 Obteniendo publicaciones...")
    const postsUrl = `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,username&access_token=${ACCESS_TOKEN}`

    const postsResponse = await fetch(postsUrl)
    const postsData = await postsResponse.json()

    if (postsResponse.ok) {
      console.log(`✅ Publicaciones obtenidas: ${postsData.data.length}`)
      console.log("📋 Primeras 3 publicaciones:")

      postsData.data.slice(0, 3).forEach((post, index) => {
        console.log(`\n${index + 1}. ID: ${post.id}`)
        console.log(`   Tipo: ${post.media_type}`)
        console.log(`   Descripción: ${post.caption ? post.caption.substring(0, 100) + "..." : "Sin descripción"}`)
        console.log(`   Fecha: ${new Date(post.timestamp).toLocaleString("es-ES")}`)
        console.log(`   Enlace: ${post.permalink}`)
      })

      // 2. Obtener comentarios para la primera publicación
      if (postsData.data.length > 0) {
        const firstPostId = postsData.data[0].id
        console.log(`\n💬 Obteniendo comentarios para publicación ${firstPostId}...`)

        const commentsUrl = `https://graph.instagram.com/v22.0/${firstPostId}/comments?fields=id,text,username,from,timestamp&access_token=${ACCESS_TOKEN}`

        const commentsResponse = await fetch(commentsUrl)
        const commentsData = await commentsResponse.json()

        if (commentsResponse.ok) {
          console.log(`✅ Comentarios obtenidos: ${commentsData.data.length}`)

          if (commentsData.data.length > 0) {
            console.log("💭 Primeros comentarios:")

            // Procesar usuarios únicos
            const usuariosUnicos = new Map()

            commentsData.data.forEach((comment, index) => {
              const username = comment.username || (comment.from ? comment.from.username : "usuario_desconocido")
              console.log(`\n${index + 1}. @${username}: ${comment.text}`)
              console.log(`   Fecha: ${new Date(comment.timestamp).toLocaleString("es-ES")}`)
              console.log(`   ID: ${comment.id}`)
              console.log(`   Red Social: Instagram`)

              // Agregar a usuarios únicos
              if (usuariosUnicos.has(username)) {
                usuariosUnicos.get(username).comentarios++
              } else {
                usuariosUnicos.set(username, {
                  username,
                  redSocial: "Instagram",
                  comentarios: 1,
                  ultimoComentario: comment.text,
                  fecha: comment.timestamp,
                })
              }
            })

            // Mostrar resumen de usuarios únicos
            console.log(`\n👥 USUARIOS ÚNICOS DE INSTAGRAM (${usuariosUnicos.size}):`)
            console.log("=".repeat(50))

            Array.from(usuariosUnicos.values()).forEach((usuario, index) => {
              console.log(`${index + 1}. @${usuario.username}`)
              console.log(`   Red Social: ${usuario.redSocial}`)
              console.log(`   Comentarios: ${usuario.comentarios}`)
              console.log(
                `   Último comentario: "${usuario.ultimoComentario.substring(0, 50)}${
                  usuario.ultimoComentario.length > 50 ? "..." : ""
                }"`,
              )
              console.log(`   Fecha: ${new Date(usuario.fecha).toLocaleString("es-ES")}`)
              console.log("")
            })
          } else {
            console.log("ℹ️  No hay comentarios en esta publicación")
          }
        } else {
          console.log("❌ Error al obtener comentarios:", commentsData.error?.message)
        }
      }
    } else {
      console.log("❌ Error al obtener publicaciones:", postsData.error?.message)

      if (postsData.error?.code === 190) {
        console.log("\n🔑 El token de acceso ha expirado o es inválido.")
        console.log("📝 Para obtener un nuevo token:")
        console.log("1. Ve a https://developers.facebook.com/tools/explorer/")
        console.log("2. Selecciona tu app de Instagram")
        console.log("3. Genera un nuevo token con los permisos necesarios")
        console.log("4. Usa el endpoint de intercambio de token de tu workflow:")
        console.log(
          "   https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=YOUR_SECRET&access_token=SHORT_LIVED_TOKEN",
        )
      }
    }
  } catch (error) {
    console.log("💥 Error de conexión:", error.message)
    console.log("\n🌐 Posibles causas:")
    console.log("- Problemas de conectividad")
    console.log("- Token de acceso expirado")
    console.log("- Límites de rate limiting de Instagram API")
  }

  // 3. Mostrar información del workflow
  console.log("\n🔧 Configuración del Workflow:")
  console.log("- Webhook URL: https://n8n-ia.garciacussi.com/webhook-testig")
  console.log("- Instagram App ID: 1345214003223885")
  console.log("- Redirect URI: https://cochago.com.bo/testig")
  console.log("- Modelo IA: OpenAI GPT-4o-mini")
  console.log("- Sitio web: https://cochago.com.bo")
}

// Ejecutar el test
testInstagramAPI()
