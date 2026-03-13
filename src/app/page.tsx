"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Play, ExternalLink, Zap, ChevronDown, ChevronUp } from "lucide-react"

interface ApiEndpoint {
  name: string
  method: string
  path: string
  file: string
  description: string
  category: "static" | "dynamic-single" | "dynamic-multi" | "catch-all" | "index"
}

const endpoints: ApiEndpoint[] = [
  // Static route
  {
    name: "Hello",
    method: "GET",
    path: "/hello",
    file: "cloud-functions/hello.go",
    description: "Static route — file name maps directly to path",
    category: "static",
  },
  // Index route
  {
    name: "List Posts",
    method: "GET",
    path: "/api/posts",
    file: "cloud-functions/api/posts/index.go",
    description: "index.go serves as the default handler for a directory",
    category: "index",
  },
  // Single dynamic param
  {
    name: "User by ID",
    method: "GET",
    path: "/api/users/u-42",
    file: "cloud-functions/api/users/[userId].go",
    description: "[userId] captures a single dynamic segment",
    category: "dynamic-single",
  },
  // Multi dynamic params
  {
    name: "User's Post",
    method: "GET",
    path: "/api/users/u-42/posts/p-7",
    file: "cloud-functions/api/users/[userId]/posts/[postId].go",
    description: "Nested dynamic params: [userId] and [postId]",
    category: "dynamic-multi",
  },
  // Catch-all
  {
    name: "File Access",
    method: "GET",
    path: "/api/files/docs/guide/intro.md",
    file: "cloud-functions/api/files/[[path]].go",
    description: "[[path]] catches all remaining path segments",
    category: "catch-all",
  },
]

const categoryLabels: Record<string, string> = {
  "static": "Static Routes",
  "index": "Index Routes",
  "dynamic-single": "Single Dynamic Param [param]",
  "dynamic-multi": "Multiple Dynamic Params",
  "catch-all": "Catch-All Routes [[param]]",
}

const categoryOrder = ["static", "index", "dynamic-single", "dynamic-multi", "catch-all"]

export default function Home() {
  const [results, setResults] = useState<Record<string, { data: string; status: number } | null>>({})
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({})
  const [expandedCode, setExpandedCode] = useState<string | null>(null)

  const handleApiCall = async (endpoint: ApiEndpoint) => {
    const key = endpoint.path
    setLoadingStates(prev => ({ ...prev, [key]: true }))
    try {
      const response = await fetch(endpoint.path)
      const data = await response.json()
      setResults(prev => ({ ...prev, [key]: { data: JSON.stringify(data, null, 2), status: response.status } }))
    } catch (error) {
      setResults(prev => ({ ...prev, [key]: { data: `Error: Failed to call ${endpoint.path}`, status: 0 } }))
    } finally {
      setLoadingStates(prev => ({ ...prev, [key]: false }))
    }
  }

  const grouped = categoryOrder.map(cat => ({
    category: cat,
    label: categoryLabels[cat],
    items: endpoints.filter(e => e.category === cat),
  }))

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <a href="https://pages.edgeone.ai" target="_blank" rel="noopener noreferrer">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center">
                  <img src="/eo-logo-blue.svg" alt="EdgeOne Pages" width={32} height={32} />
                </div>
                <h1 className="text-lg font-semibold">EdgeOne Pages</h1>
              </div>
            </a>
            <a
              href="https://github.com/TencentEdgeOne/go-handler-template"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Title */}
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-bold leading-tight">
              Go Functions on EdgeOne Pages
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Go Functions use file-based routing — each <code className="text-blue-400">.go</code> file in{" "}
              <code className="text-blue-400">cloud-functions/</code> automatically maps to an HTTP endpoint.
              Supports static routes, dynamic parameters, nested params, and catch-all patterns.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a href="https://edgeone.ai/pages/new?from=github&template=go-handler-template" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-[#1c66e5] hover:bg-[#1c66e5]/90 text-white px-8 py-3 text-lg cursor-pointer">
                <Zap className="w-5 h-5 mr-2" />
                One-Click Deployment
              </Button>
            </a>
            <a href="https://pages.edgeone.ai/document/go-functions" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="lg" className="border-gray-600 hover:bg-gray-800 text-white px-8 py-3 text-lg cursor-pointer">
                <ExternalLink className="w-5 h-5 mr-2" />
                View Documentation
              </Button>
            </a>
          </div>

          {/* File Structure Card */}
          <Card className="bg-gray-900 border-gray-700 text-left">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-mono text-gray-400">
                📁 File-Based Routing Structure
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-sm text-gray-200 font-mono leading-relaxed">
{`cloud-functions/
├── hello.go                              → GET /hello
├── api/
│   ├── posts/
│   │   └── index.go                      → GET /api/posts
│   ├── users/
│   │   ├── [userId].go                   → GET /api/users/:userId
│   │   └── [userId]/
│   │       └── posts/
│   │           └── [postId].go           → GET /api/users/:userId/posts/:postId
│   └── files/
│       └── [[path]].go                   → GET /api/files/*path (catch-all)`}
              </pre>
            </CardContent>
          </Card>

          {/* API Endpoints by Category */}
          {grouped.map(group => (
            <div key={group.category} className="space-y-3">
              <h2 className="text-lg font-semibold text-gray-300 border-b border-gray-800 pb-2">
                {group.label}
              </h2>
              {group.items.map(endpoint => {
                const key = endpoint.path
                const result = results[key]
                const isLoading = loadingStates[key]
                const isExpanded = expandedCode === key

                return (
                  <Card key={key} className="bg-gray-900 border-gray-700">
                    <CardContent className="pt-5 pb-4 space-y-3">
                      {/* Endpoint header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono bg-blue-600/20 text-blue-400 px-2 py-0.5 rounded">
                              {endpoint.method}
                            </span>
                            <span className="font-mono text-sm text-gray-200">{endpoint.path}</span>
                          </div>
                          <p className="text-xs text-gray-500">{endpoint.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setExpandedCode(isExpanded ? null : key)}
                            className="text-xs text-gray-500 hover:text-gray-300 flex items-center gap-1 cursor-pointer"
                          >
                            <span className="font-mono">{endpoint.file.split("/").pop()}</span>
                            {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                          </button>
                          <Button
                            size="sm"
                            onClick={() => handleApiCall(endpoint)}
                            disabled={isLoading}
                            className="bg-[#1c66e5] hover:bg-[#1c66e5]/90 text-white cursor-pointer"
                          >
                            {isLoading ? (
                              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-1" />
                            ) : (
                              <Play className="w-3 h-3 mr-1" />
                            )}
                            Call
                          </Button>
                        </div>
                      </div>

                      {/* Expandable source file path */}
                      {isExpanded && (
                        <div className="bg-gray-800 rounded px-3 py-2">
                          <p className="text-xs text-gray-400 font-mono">
                            📄 {endpoint.file}
                          </p>
                        </div>
                      )}

                      {/* Result */}
                      {result && (
                        <div className="text-left">
                          <p className="text-xs text-gray-500 mb-1">
                            Response{result.status > 0 ? ` (${result.status})` : ""}:
                          </p>
                          <pre className="text-green-400 font-mono text-xs bg-gray-800 px-3 py-2 rounded overflow-x-auto">
                            {result.data}
                          </pre>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-16">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center text-gray-400">
            <p>Powered by EdgeOne Pages</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
