"use client";

import { useState } from "react";
import {
  useFetchRatingsQuery,
  useLazyFetchReviewsByUsernameQuery,
  useDeleteRatingMutation,
} from "@/lib/features/ratings/ratingsApi";
import { DataTable } from "@/components/ui/data-table";
import { Pagination } from "@/components/ui/pagination";
import { FilterSelect } from "@/components/ui/filter-select";
import { StarRating } from "@/components/ui/star-rating";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Star,
  MessageSquare,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  Clock,
  CheckCircle,
  XCircle,
  Trash2,
  Eye,
  User,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Rating {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  project: {
    id: string;
    name: string;
  };
  rating: number;
  comment: string;
  sentiment: "positive" | "neutral" | "negative";
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  respondedAt?: string;
  adminResponse?: string;
}

export default function RatingsPage() {
  const { toast } = useToast();

  // State for filters and pagination
  const [filters, setFilters] = useState({
    page: 1,
    search: "",
    rating: "all",
    sentiment: "all",
    status: "all",
  });

  // Dialog states
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    rating: Rating | null;
  }>({
    open: false,
    rating: null,
  });

  const [viewDialog, setViewDialog] = useState<{
    open: boolean;
    rating: Rating | null;
  }>({
    open: false,
    rating: null,
  });

  const [userReviewsDialog, setUserReviewsDialog] = useState<{
    open: boolean;
    username: string;
  }>({
    open: false,
    username: "",
  });

  const [usernameInput, setUsernameInput] = useState("");

  // RTK Query hooks
  const {
    data: ratingsData,
    isLoading,
    error,
    refetch,
  } = useFetchRatingsQuery(filters);

  const [
    fetchUserReviews,
    { data: userReviews, isLoading: userReviewsLoading },
  ] = useLazyFetchReviewsByUsernameQuery();

  const [deleteRating, { isLoading: deleteLoading }] =
    useDeleteRatingMutation();

  // Extract data from response
  const ratings = ratingsData?.ratings || [];
  const totalPages = ratingsData?.totalPages || 1;
  const totalRatings = ratingsData?.totalRatings || 0;
  const currentPage = ratingsData?.currentPage || 1;

  // Filter handlers
  const handleSearch = (term: string) => {
    setFilters((prev) => ({ ...prev, search: term, page: 1 }));
  };

  const handleRatingFilter = (rating: string) => {
    setFilters((prev) => ({ ...prev, rating, page: 1 }));
  };

  const handleSentimentFilter = (sentiment: string) => {
    setFilters((prev) => ({ ...prev, sentiment, page: 1 }));
  };

  const handleStatusFilter = (status: string) => {
    setFilters((prev) => ({ ...prev, status, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleRefresh = () => {
    refetch();
  };

  // Action handlers
  const handleView = (rating: Rating) => {
    setViewDialog({ open: true, rating });
  };

  const handleRespond = (rating: Rating) => {
    toast({
      title: "Respond to Rating",
      description: `Responding to ${rating.user.name}'s feedback`,
    });
  };

  const handleDelete = (rating: Rating) => {
    setDeleteDialog({ open: true, rating });
  };

  const confirmDelete = async () => {
    if (deleteDialog.rating) {
      try {
        await deleteRating(deleteDialog.rating.id).unwrap();
        toast({
          title: "Success",
          description: "Review deleted successfully",
        });
        setDeleteDialog({ open: false, rating: null });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete review",
          variant: "destructive",
        });
      }
    }
  };

  const handleFetchUserReviews = async () => {
    if (usernameInput.trim()) {
      try {
        await fetchUserReviews(usernameInput.trim()).unwrap();
        setUserReviewsDialog({ open: true, username: usernameInput.trim() });
        setUsernameInput("");
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch user reviews",
          variant: "destructive",
        });
      }
    }
  };

  // Helper functions
  const getSentimentBadgeVariant = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "default";
      case "neutral":
        return "secondary";
      case "negative":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return ThumbsUp;
      case "negative":
        return ThumbsDown;
      default:
        return MessageSquare;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "approved":
        return "default";
      case "pending":
        return "secondary";
      case "rejected":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return CheckCircle;
      case "rejected":
        return XCircle;
      default:
        return Clock;
    }
  };

  // Table columns configuration
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
      render: (project: Rating["project"]) => (
        <span className="font-medium">{project.name}</span>
      ),
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
        const Icon = getSentimentIcon(value);
        return (
          <Badge
            variant={getSentimentBadgeVariant(value)}
            className="flex items-center space-x-1"
          >
            <Icon className="h-3 w-3" />
            <span>{value}</span>
          </Badge>
        );
      },
    },
    {
      key: "status" as keyof Rating,
      label: "Status",
      render: (value: string, rating: Rating) => {
        const Icon = getStatusIcon(value);
        return (
          <Badge
            variant={getStatusBadgeVariant(value)}
            className="flex items-center space-x-1"
          >
            <Icon className="h-3 w-3" />
            <span>{value}</span>
          </Badge>
        );
      },
    },
    {
      key: "createdAt" as keyof Rating,
      label: "Date",
      render: (value: string) => (
        <span className="text-sm text-muted-foreground">
          {new Date(value).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: "actions" as keyof Rating,
      label: "Actions",
      render: (value: any, rating: Rating) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleView(rating)}
          >
            <Eye className="h-3 w-3" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDelete(rating)}
            disabled={deleteLoading}
          >
            {deleteLoading ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Trash2 className="h-3 w-3" />
            )}
          </Button>
        </div>
      ),
    },
  ];

  // Filter options
  const ratingOptions = [
    { value: "all", label: "All Ratings" },
    { value: "5", label: "5 Stars" },
    { value: "4", label: "4 Stars" },
    { value: "3", label: "3 Stars" },
    { value: "2", label: "2 Stars" },
    { value: "1", label: "1 Star" },
  ];

  const sentimentOptions = [
    { value: "all", label: "All Sentiments" },
    { value: "positive", label: "Positive" },
    { value: "neutral", label: "Neutral" },
    { value: "negative", label: "Negative" },
  ];

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
  ];

  // Calculate stats
  const averageRating =
    ratings.length > 0
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
      : 0;
  const pendingRatings = ratings.filter((r) => r.status === "pending").length;
  const positiveRatings = ratings.filter(
    (r) => r.sentiment === "positive"
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Rating Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Monitor and manage user feedback and ratings
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Enter username"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              className="w-40"
            />
            <Button
              variant="outline"
              onClick={handleFetchUserReviews}
              disabled={userReviewsLoading}
            >
              {userReviewsLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <User className="h-4 w-4 mr-2" />
              )}
              User Reviews
            </Button>
          </div>
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
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
            <CardTitle className="text-sm font-medium">
              Average Rating
            </CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageRating.toFixed(1)}</div>
            <StarRating rating={Math.round(averageRating)} size="sm" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Reviews
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingRatings}</div>
            <p className="text-xs text-muted-foreground">Awaiting moderation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Positive Feedback
            </CardTitle>
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
          <AlertDescription>
            {typeof error === "object" && "message" in error
              ? error.message
              : "An error occurred"}
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Ratings</CardTitle>
            <div className="flex items-center space-x-2">
              <FilterSelect
                placeholder="Filter by rating"
                value={filters.rating}
                onValueChange={handleRatingFilter}
                options={ratingOptions}
              />
              <FilterSelect
                placeholder="Filter by sentiment"
                value={filters.sentiment}
                onValueChange={handleSentimentFilter}
                options={sentimentOptions}
              />
              <FilterSelect
                placeholder="Filter by status"
                value={filters.status}
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
            onDelete={handleDelete}
            isLoading={isLoading}
          />

          {totalPages > 1 && (
            <div className="mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, rating: null })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Review</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this review from{" "}
              {deleteDialog.rating?.user.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialog({ open: false, rating: null })}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteLoading}
            >
              {deleteLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Delete Review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Review Dialog */}
      <Dialog
        open={viewDialog.open}
        onOpenChange={(open) => setViewDialog({ open, rating: null })}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Review Details</DialogTitle>
            <DialogDescription>
              Detailed information about this review
            </DialogDescription>
          </DialogHeader>
          {viewDialog.rating && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>User</Label>
                  <p className="text-sm font-medium">
                    {viewDialog.rating.user.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {viewDialog.rating.user.email}
                  </p>
                </div>
                <div>
                  <Label>Project</Label>
                  <p className="text-sm font-medium">
                    {viewDialog.rating.project.name}
                  </p>
                </div>
                <div>
                  <Label>Rating</Label>
                  <StarRating rating={viewDialog.rating.rating} showNumber />
                </div>
                <div>
                  <Label>Status</Label>
                  <Badge
                    variant={getStatusBadgeVariant(viewDialog.rating.status)}
                  >
                    {viewDialog.rating.status}
                  </Badge>
                </div>
              </div>
              <div>
                <Label>Comment</Label>
                <p className="text-sm mt-1 p-3 bg-muted rounded-md">
                  {viewDialog.rating.comment}
                </p>
              </div>
              {viewDialog.rating.adminResponse && (
                <div>
                  <Label>Admin Response</Label>
                  <p className="text-sm mt-1 p-3 bg-primary/10 rounded-md">
                    {viewDialog.rating.adminResponse}
                  </p>
                </div>
              )}
              <div className="text-xs text-muted-foreground">
                Created:{" "}
                {new Date(viewDialog.rating.createdAt).toLocaleString()}
                {viewDialog.rating.respondedAt && (
                  <span className="ml-4">
                    Responded:{" "}
                    {new Date(viewDialog.rating.respondedAt).toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setViewDialog({ open: false, rating: null })}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* User Reviews Dialog */}
      <Dialog
        open={userReviewsDialog.open}
        onOpenChange={(open) => setUserReviewsDialog({ open, username: "" })}
      >
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Reviews by {userReviewsDialog.username}</DialogTitle>
            <DialogDescription>
              All reviews submitted by this user
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-96 overflow-y-auto">
            {userReviews && userReviews.length > 0 ? (
              <div className="space-y-4">
                {userReviews.map((review) => (
                  <div key={review.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <StarRating rating={review.rating} showNumber />
                        <Badge
                          variant={getSentimentBadgeVariant(review.sentiment)}
                        >
                          {review.sentiment}
                        </Badge>
                        <Badge variant={getStatusBadgeVariant(review.status)}>
                          {review.status}
                        </Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm font-medium mb-1">
                      Project: {review.project.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No reviews found for this user.
              </p>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setUserReviewsDialog({ open: false, username: "" })
              }
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
