"use client"

import { useState, useEffect } from "react"
import { Search, Filter, MoreHorizontal, Mail, Phone, Shield, ShieldAlert, UserX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { useAuth } from "@/hooks/use-auth"

// Mock users for the admin panel
const mockUsers = [
  {
    id: "1",
    name: "John Doe",
    email: "user@example.com",
    phone: "+1 (555) 123-4567",
    isAdmin: false,
    createdAt: new Date("2023-01-15"),
    lastLogin: new Date("2023-06-10"),
    status: "active",
    bookings: 3,
  },
  {
    id: "2",
    name: "Admin User",
    email: "admin@example.com",
    phone: "+1 (555) 987-6543",
    isAdmin: true,
    createdAt: new Date("2022-11-05"),
    lastLogin: new Date("2023-06-20"),
    status: "active",
    bookings: 1,
  },
  {
    id: "3",
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "+1 (555) 222-3333",
    isAdmin: false,
    createdAt: new Date("2023-03-22"),
    lastLogin: new Date("2023-05-15"),
    status: "active",
    bookings: 2,
  },
  {
    id: "4",
    name: "Robert Johnson",
    email: "robert@example.com",
    phone: "+1 (555) 444-5555",
    isAdmin: false,
    createdAt: new Date("2023-02-10"),
    lastLogin: new Date("2023-04-30"),
    status: "inactive",
    bookings: 0,
  },
  {
    id: "5",
    name: "Emily Davis",
    email: "emily@example.com",
    phone: "+1 (555) 666-7777",
    isAdmin: false,
    createdAt: new Date("2023-04-05"),
    lastLogin: new Date("2023-06-18"),
    status: "active",
    bookings: 5,
  },
]

export default function UsersPage() {
  const { toast } = useToast()
  const { user: currentUser } = useAuth() // Get the current user
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  // Use the mockUsers as a starting point, but add the current user if they're not already in the list
  const [users, setUsers] = useState(() => {
    if (currentUser && !mockUsers.some((u) => u.email === currentUser.email)) {
      return [
        ...mockUsers,
        {
          id: currentUser.id,
          name: currentUser.name,
          email: currentUser.email,
          phone: currentUser.phone || "+1 (555) 000-0000",
          isAdmin: currentUser.isAdmin,
          createdAt: new Date(),
          lastLogin: new Date(),
          status: "active",
          bookings: 0,
        },
      ]
    }
    return mockUsers
  })

  const [filteredUsers, setFilteredUsers] = useState(users)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    setFilteredUsers(
      users.filter((user) => {
        const matchesSearch =
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.phone.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesRole =
          roleFilter === "all" || (roleFilter === "admin" && user.isAdmin) || (roleFilter === "user" && !user.isAdmin)

        const matchesStatus = statusFilter === "all" || user.status === statusFilter

        return matchesSearch && matchesRole && matchesStatus
      }),
    )
  }, [users, searchTerm, roleFilter, statusFilter])

  const handleToggleAdmin = (userId: string) => {
    setUsers((prev) => prev.map((user) => (user.id === userId ? { ...user, isAdmin: !user.isAdmin } : user)))

    const user = users.find((u) => u.id === userId)

    toast({
      title: `User role updated`,
      description: `${user?.name} is now ${user?.isAdmin ? "a regular user" : "an administrator"}.`,
    })
  }

  const handleToggleStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, status: user.status === "active" ? "inactive" : "active" } : user,
      ),
    )

    const user = users.find((u) => u.id === userId)

    toast({
      title: `User status updated`,
      description: `${user?.name} is now ${user?.status === "active" ? "inactive" : "active"}.`,
    })
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
  }

  // Stats for dashboard
  const totalUsers = users.length
  const adminUsers = users.filter((u) => u.isAdmin).length
  const activeUsers = users.filter((u) => u.status === "active").length

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">User Management</h1>
          <p className="text-muted-foreground">Manage user accounts and permissions</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{activeUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Administrators</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{adminUsers}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-4">
          <div className="w-40">
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger>
                <div className="flex items-center">
                  <Filter className="mr-2 h-4 w-4" />
                  <span>Role</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Administrators</SelectItem>
                <SelectItem value="user">Regular Users</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-40">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <div className="flex items-center">
                  <Filter className="mr-2 h-4 w-4" />
                  <span>Status</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
              <p className="mt-4 text-muted-foreground">Loading users...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No users found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4">User</th>
                    <th className="text-left p-4">Contact</th>
                    <th className="text-left p-4">Role</th>
                    <th className="text-left p-4">Status</th>
                    <th className="text-left p-4">Joined</th>
                    <th className="text-left p-4">Bookings</th>
                    <th className="text-left p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-muted/50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback className="bg-primary text-primary-foreground">
                              {getInitials(user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{user.email}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{user.phone}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant={user.isAdmin ? "default" : "outline"}>
                          {user.isAdmin ? (
                            <div className="flex items-center">
                              <Shield className="h-3 w-3 mr-1" />
                              Admin
                            </div>
                          ) : (
                            "User"
                          )}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Badge variant={user.status === "active" ? "outline" : "secondary"}>
                          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                        </Badge>
                      </td>
                      <td className="p-4 text-sm">
                        <div>{format(user.createdAt, "MMM d, yyyy")}</div>
                        <div className="text-xs text-muted-foreground">
                          Last login: {format(user.lastLogin, "MMM d, yyyy")}
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <span className="font-medium">{user.bookings}</span>
                      </td>
                      <td className="p-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleToggleAdmin(user.id)}>
                              {user.isAdmin ? (
                                <>
                                  <UserX className="h-4 w-4 mr-2" />
                                  Remove Admin
                                </>
                              ) : (
                                <>
                                  <Shield className="h-4 w-4 mr-2" />
                                  Make Admin
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleToggleStatus(user.id)}>
                              {user.status === "active" ? (
                                <>
                                  <ShieldAlert className="h-4 w-4 mr-2" />
                                  Deactivate
                                </>
                              ) : (
                                <>
                                  <Shield className="h-4 w-4 mr-2" />
                                  Activate
                                </>
                              )}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

