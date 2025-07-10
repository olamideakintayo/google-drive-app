"use client"

import React, { useState } from "react"
import {
  Search,
  Grid3X3,
  List,
  MoreVertical,
  Folder,
  FileText,
  ImageIcon,
  Video,
  Music,
  Archive,
  CloudUpload,
} from "lucide-react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Card, CardContent } from "~/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb"
import { Badge } from "~/components/ui/badge"

const mockData = {
  root: {
    id: "root",
    name: "My Drive",
    type: "folder",
    items: [
      {
        id: "1",
        name: "Documents",
        type: "folder",
        modified: "2024-01-15",
        items: [
          {
            id: "1-1",
            name: "Resume.pdf",
            type: "file",
            fileType: "pdf",
            size: "2.3 MB",
            modified: "2024-01-10",
            url: "/documents/resume.pdf",
          },
          {
            id: "1-2",
            name: "Cover Letter.docx",
            type: "file",
            fileType: "document",
            size: "1.1 MB",
            modified: "2024-01-12",
            url: "/documents/cover-letter.docx",
          },
          {
            id: "1-3",
            name: "Project Proposal.pdf",
            type: "file",
            fileType: "pdf",
            size: "5.2 MB",
            modified: "2024-01-15",
            url: "/documents/proposal.pdf",
          },
        ],
      },
      {
        id: "2",
        name: "Photos",
        type: "folder",
        modified: "2024-01-20",
        items: [
          {
            id: "2-1",
            name: "Vacation 2024",
            type: "folder",
            modified: "2024-01-20",
            items: [
              {
                id: "2-1-1",
                name: "beach.jpg",
                type: "file",
                fileType: "image",
                size: "3.2 MB",
                modified: "2024-01-18",
                url: "/photos/beach.jpg",
              },
              {
                id: "2-1-2",
                name: "sunset.jpg",
                type: "file",
                fileType: "image",
                size: "2.8 MB",
                modified: "2024-01-19",
                url: "/photos/sunset.jpg",
              },
            ],
          },
          {
            id: "2-2",
            name: "profile.png",
            type: "file",
            fileType: "image",
            size: "1.5 MB",
            modified: "2024-01-20",
            url: "/photos/profile.png",
          },
        ],
      },
      {
        id: "3",
        name: "Videos",
        type: "folder",
        modified: "2024-01-18",
        items: [
          {
            id: "3-1",
            name: "presentation.mp4",
            type: "file",
            fileType: "video",
            size: "45.2 MB",
            modified: "2024-01-18",
            url: "/videos/presentation.mp4",
          },
          {
            id: "3-2",
            name: "demo.mov",
            type: "file",
            fileType: "video",
            size: "23.1 MB",
            modified: "2024-01-17",
            url: "/videos/demo.mov",
          },
        ],
      },
      {
        id: "4",
        name: "Spreadsheet.xlsx",
        type: "file",
        fileType: "document",
        size: "892 KB",
        modified: "2024-01-22",
        url: "/files/spreadsheet.xlsx",
      },
      {
        id: "5",
        name: "Archive.zip",
        type: "file",
        fileType: "archive",
        size: "12.3 MB",
        modified: "2024-01-21",
        url: "/files/archive.zip",
      },
      {
        id: "6",
        name: "Music.mp3",
        type: "file",
        fileType: "audio",
        size: "4.2 MB",
        modified: "2024-01-19",
        url: "/files/music.mp3",
      },
    ],
  },
}

const getFileIcon = (fileType: string) => {
  switch (fileType) {
    case "image": return <ImageIcon className="w-6 h-6 text-blue-400" />
    case "video": return <Video className="w-6 h-6 text-red-400" />
    case "audio": return <Music className="w-6 h-6 text-purple-400" />
    case "pdf": return <FileText className="w-6 h-6 text-red-400" />
    case "document": return <FileText className="w-6 h-6 text-blue-400" />
    case "archive": return <Archive className="w-6 h-6 text-yellow-400" />
    default: return <FileText className="w-6 h-6 text-gray-400" />
  }
}

const findItemById = (items: any[], id: string): any => {
  for (const item of items) {
    if (item.id === id) return item
    if (item.items) {
      const found = findItemById(item.items || [], id)
      if (found) return found
    }
  }
  return null
}

const buildBreadcrumbs = (currentPath: string[], data: any) => {
  const breadcrumbs = [{ id: "root", name: "My Drive" }]
  let current = data.root

  for (const pathId of currentPath) {
    if (pathId === "root") continue
    current = findItemById(current.items || [], pathId)
    if (current) {
      breadcrumbs.push({ id: current.id, name: current.name })
    }
  }

  return breadcrumbs
}

export default function GoogleDriveClone() {
  const [currentPath, setCurrentPath] = useState(["root"])
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const [searchQuery, setSearchQuery] = useState("")

  const getCurrentFolder = () => {
    if (currentPath.length === 1 && currentPath[0] === "root") return mockData.root

    let current = mockData.root
    for (let i = 1; i < currentPath.length; i++) {
      current = findItemById(current.items || [], currentPath[i])
      if (!current) return mockData.root
    }
    return current
  }

  const currentFolder = getCurrentFolder()
  const breadcrumbs = buildBreadcrumbs(currentPath, mockData)

  const handleFolderClick = (folderId: string) => {
    setCurrentPath([...currentPath, folderId])
  }

  const handleBreadcrumbClick = (index: number) => {
    setCurrentPath(currentPath.slice(0, index + 1))
  }

  const handleFileClick = (url?: string) => {
    if (!url) return
    window.open(url, "_blank")
  }

  const handleUpload = () => {
    alert("Upload functionality would be implemented here!")
  }

  const filteredItems =
    currentFolder.items?.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase())) || []

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* ... header omitted for brevity ... */}
      <main className="p-6">
        {/* ... breadcrumbs omitted for brevity ... */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
            {filteredItems.map((item) => (
              <Card key={item.id} onClick={() => item.type === "folder" ? handleFolderClick(item.id) : handleFileClick(item.url)}>
                <CardContent className="p-4 text-center">
                  <div className="flex justify-center mb-3">
                    {item.type === "folder" ? <Folder className="w-12 h-12 text-blue-400" /> : getFileIcon(item.fileType)}
                  </div>
                  <p className="text-sm font-medium truncate text-white mb-1">{item.name}</p>
                  <p className="text-xs text-gray-400">{item.modified || "-"}</p>
                  {item.size && (
                    <Badge variant="secondary" className="text-xs mt-2 bg-gray-700 text-gray-300">
                      {item.size}
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
            <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-700 bg-gray-750 text-sm font-medium text-gray-300">
              <div className="col-span-6">Name</div>
              <div className="col-span-2">Modified</div>
              <div className="col-span-2">Size</div>
              <div className="col-span-2"></div>
            </div>
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-12 gap-4 p-4 border-b border-gray-700 hover:bg-gray-700 cursor-pointer transition-colors"
                onClick={() => item.type === "folder" ? handleFolderClick(item.id) : handleFileClick(item.url)}
              >
                <div className="col-span-6 flex items-center gap-3">
                  {item.type === "folder" ? <Folder className="w-6 h-6 text-blue-400" /> : getFileIcon(item.fileType)}
                  <span className="font-medium text-white">{item.name}</span>
                </div>
                <div className="col-span-2 text-gray-400 text-sm flex items-center">{item.modified || "-"}</div>
                <div className="col-span-2 text-gray-400 text-sm flex items-center">{item.size || "-"}</div>
                <div className="col-span-2 flex justify-end items-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()} className="hover:bg-gray-600">
                        <MoreVertical className="w-4 h-4 text-gray-400" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
                      <DropdownMenuItem className="text-gray-300 hover:bg-gray-700">Share</DropdownMenuItem>
                      <DropdownMenuItem className="text-gray-300 hover:bg-gray-700">Download</DropdownMenuItem>
                      <DropdownMenuItem className="text-gray-300 hover:bg-gray-700">Rename</DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-gray-700" />
                      <DropdownMenuItem className="text-red-400 hover:bg-gray-700">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        )}
        {filteredItems.length === 0 && (
          <div className="text-center py-16">
            <Folder className="w-20 h-20 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">
              {searchQuery ? "No files found matching your search" : "This folder is empty"}
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
