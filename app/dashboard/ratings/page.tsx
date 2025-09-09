"use client"

import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import {
  fetchRatings,
  setSearchTerm,
  setRatingFilter,
  setSentimentFilter,
  setStatusFilter,
  setCurrentPage,
} from "@/lib/features/ratings/ratingsSlice"
import { DataTable } from "@/components/ui/data-table"
import { Pagination } from "@/components/ui/pagination"
import { FilterSelect } from "@/components/ui/filter-select"
import { StarRating } from "@/components/ui/star-rating"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Star, MessageSquare, RefreshCw, ThumbsUp, ThumbsDown, Clock, CheckCircle, XCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Rating {
  id: string
  user: {
    id: string
    name: string
    email: string
  }
  project: {
    id: string
    name: string
  }
  rating: number
  comment: string
  sentiment: "positive" | "neutral" | "negative"
  status: "pending" | "approved" | "rejected"
  createdAt: string
  respondedAt?: string
  adminResponse?: string
}

export default function RatingsPage() {
  const dispatch = useAppDispatch()
  const {
    ratings,
    isLoading,
    error,
    searchTerm,
    ratingFilter,
    sentimentFilter,
    statusFilter,
    currentPage,
    totalPages,
    totalRatings,
  } = useAppSelector((state) => state.ratings)
  const { toast } = useToast()

  useEffect(() => {
    dispatch(
      fetchRatings({
        page: currentPage,
        search: searchTerm,
        rating: ratingFilter,
        sentiment: sentimentFilter,
        status: statusFilter,
      }),
    )
  }, [dispatch, currentPage, searchTerm, ratingFilter, sentimentFilter, statusFilter])

  const handleSearch = (term: string) => {
    dispatch(setSearchTerm(term))
  }

  const handleRatingFilter = (rating: string) => {
    dispatch(setRatingFilter(rating))
  }

  const handleSentimentFilter = (sentiment: string) => {
    dispatch(setSentimentFilter(sentiment))
  }

  const handleStatusFilter = (status: string) => {
    dispatch(setStatusFilter(status))
  }

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page))
  }

  const handleRefresh = () => {
    dispatch(
      fetchRatings({
        page: currentPage,
        search: searchTerm,
        rating: ratingFilter,
        sentiment: sentimentFilter,
        status: statusFilter,
      }),
    )
  }

  const handleView = (rating: Rating) => {
    toast({
      title: "Rating Details",
      description: `Viewing rating from ${rating.user.name}`,
    })
  }

  const handleRespond = (rating: Rating) => {
    toast({
      title: "Respond to Rating",
      description: `Responding to ${rating.user.name}'s feedback`,
    })
  }

  const handleModerate = (rating: Rating) => {
    toast({
      title: "Moderate Rating",
      description: `Moderating rating from ${rating.user.name}`,
    })
  }

  const getSentimentBadgeVariant = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "default"
      case "neutral":
        return "secondary"
      case "negative":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return ThumbsUp
      case "negative":
        return ThumbsDown
      default:
        return MessageSquare
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "approved":
        return "default"
      case "pending":
        return "secondary"
      case "rejected":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return CheckCircle
      case "rejected":
        return XCircle
      default:
        return Clock
    }
  }

  const columns = [
    {
      key: "user" as keyof Rating,
      label: "User",
      render: (user: Rating["user"]) => (
        <div>
          <p className="font-medium">{user.name}</p>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
      ),
    },
    {
      key: "project" as keyof Rating,
      label: "Project",
      render: (project: Rating["project"]) => <span className="font-medium">{project.name}</span>,
    },
    {
      key: "rating" as keyof Rating,
      label: "Rating",
      render: (value: number) => <StarRating rating={value} showNumber />,
    },
    {
      key: "comment" as keyof Rating,
      label: "Comment",
      render: (value: string) => (
        <div className="max-w-[300px]">
          <p className="text-sm truncate" title={value}>
            {value}
          </p>
        </div>
      ),
    },
    {
      key: "sentiment" as keyof Rating,
      label: "Sentiment",
      render: (value: string, rating: Rating) => {
        const Icon = getSentimentIcon(value)
        return (
          <Badge variant={getSentimentBadgeVariant(value)} className="flex items-center space-x-1">
            <Icon className="h-3 w-3" />
            <span>{value}</span>
          </Badge>
        )
      },
    },
    {
      key: "status" as keyof Rating,
      label: "Status",
      render: (value: string, rating: Rating) => {
        const Icon = getStatusIcon(value)
        return (
          <Badge variant={getStatusBadgeVariant(value)} className="flex items-center space-x-1">
            <Icon className="h-3 w-3" />
            <span>{value}</span>
          </Badge>
        )
      },
    },
    {
      key: "createdAt" as keyof Rating,
      label: "Date",
      render: (value: string) => (
        <span className="text-sm text-muted-foreground">{new Date(value).toLocaleDateString()}</span>
      ),
    },
  ]

  const ratingOptions = [
    { value: "all", label: "All Ratings" },
    { value: "5", label: "5 Stars" },
    { value: "4", label: "4 Stars" },
    { value: "3", label: "3 Stars" },
    { value: "2", label: "2 Stars" },
    { value: "1", label: "1 Star" },
  ]

  const sentimentOptions = [
    { value: "all", label: "All Sentiments" },
    { value: "positive", label: "Positive" },
    { value: "neutral", label: "Neutral" },
    { value: "negative", label: "Negative" },
  ]

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
  ]

  // Calculate stats
  const averageRating = ratings.length > 0 ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length : 0
  const pendingRatings = ratings.filter((r) => r.status === "pending").length
  const positiveRatings = ratings.filter((r) => r.sentiment === "positive").length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Rating Management</h1>
          <p className="text-muted-foreground mt-2">Monitor and manage user feedback and ratings</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Ratings</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRatings}</div>
            <p className="text-xs text-muted-foreground">All time reviews</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageRating.toFixed(1)}</div>
            <StarRating rating={Math.round(averageRating)} size="sm" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingRatings}</div>
            <p className="text-xs text-muted-foreground">Awaiting moderation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Positive Feedback</CardTitle>
            <ThumbsUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{positiveRatings}</div>
            <p className="text-xs text-muted-foreground">Happy customers</p>
          </CardContent>
        </Card>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Ratings</CardTitle>
            <div className="flex items-center space-x-2">
              <FilterSelect
                placeholder="Filter by rating"
                value={ratingFilter}
                onValueChange={handleRatingFilter}
                options={ratingOptions}
              />
              <FilterSelect
                placeholder="Filter by sentiment"
                value={sentimentFilter}
                onValueChange={handleSentimentFilter}
                options={sentimentOptions}
              />
              <FilterSelect
                placeholder="Filter by status"
                value={statusFilter}
                onValueChange={handleStatusFilter}
                options={statusOptions}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            data={ratings}
            columns={columns}
            searchPlaceholder="Search ratings..."
            onSearch={handleSearch}
            onView={handleView}
            onEdit={handleRespond}
            onDelete={handleModerate}
            isLoading={isLoading}
          />

          {totalPages > 1 && (
            <div className="mt-6">
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
