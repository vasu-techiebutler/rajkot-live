"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  ArrowLeft,
  ArrowRight,
  Loader2,
  MapPin,
  X,
  Search,
  Image as ImageIcon,
  Check,
  Upload,
  Trash2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth-context";
import { createPost } from "@/lib/api/postService";
import { uploadImages } from "@/lib/api/uploadService";
import { PostCategory } from "@/lib/types";
import { categoryLabels, categoryColors } from "@/lib/mock-data";

const MapPicker = dynamic(() => import("@/components/MapPicker"), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] bg-muted rounded-lg flex items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin" />
    </div>
  ),
});

const schema = yup.object({
  title: yup
    .string()
    .min(5, "Min 5 characters")
    .max(200)
    .required("Title is required"),
  content: yup
    .string()
    .min(20, "Min 20 characters")
    .required("Content is required"),
  category: yup
    .string()
    .oneOf(["EVENT", "FOOD", "SPORTS", "DAYRO", "OTHER"])
    .required("Category is required"),
  image: yup.string().notRequired().default(""),
});

type FormData = yup.InferType<typeof schema>;

const categories: PostCategory[] = [
  "EVENT",
  "FOOD",
  "SPORTS",
  "DAYRO",
  "OTHER",
];

export default function CreatePostPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [locationName, setLocationName] = useState("");
  const [locationAddress, setLocationAddress] = useState("");
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [searchingLocation, setSearchingLocation] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: { category: "OTHER" },
  });

  const watchedCategory = watch("category");
  const watchedTitle = watch("title");
  const watchedContent = watch("content");

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      setImagePreview(dataUrl);
      setValue("image", dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setValue("image", "");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleLocationChange = useCallback((newLat: number, newLng: number) => {
    setLat(newLat);
    setLng(newLng);
  }, []);

  const handleFindOnMap = async () => {
    const query = locationAddress || locationName;
    if (!query) return;
    setSearchingLocation(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          query + " Rajkot"
        )}&format=json&limit=1`
      );
      const data = await res.json();
      if (data && data.length > 0) {
        const newLat = parseFloat(data[0].lat);
        const newLng = parseFloat(data[0].lon);
        setLat(newLat);
        setLng(newLng);
      }
    } catch {
      // silently fail
    } finally {
      setSearchingLocation(false);
    }
  };

  const clearLocation = () => {
    setLocationName("");
    setLocationAddress("");
    setLat(null);
    setLng(null);
  };

  const onSubmit = async (data: FormData) => {
    if (!user) {
      router.push("/login");
      return;
    }
    setSubmitting(true);
    try {
      // Upload image to S3 first
      let imageUrls: string[] = [];
      if (imageFile) {
        const uploaded = await uploadImages([imageFile]);
        imageUrls = uploaded.map((f) => f.url);
      }

      const post = await createPost({
        title: data.title,
        content: data.content,
        category: data.category as PostCategory,
        images: imageUrls.length > 0 ? imageUrls : undefined,
        address: locationAddress || locationName || undefined,
        locationCoordinate: lat && lng ? `${lat},${lng}` : undefined,
      });
      router.push(`/post/${post.id}`);
    } catch {
      // handle error
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-2">Sign in to create a post</h2>
        <Button asChild className="mt-4">
          <a href="/login">Login</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Create a Post</h1>

      {/* Step indicators */}
      <div className="flex items-center gap-2 mb-6">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === s
                  ? "bg-primary text-primary-foreground"
                  : step > s
                  ? "bg-green-100 text-green-700"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {step > s ? <Check className="h-4 w-4" /> : s}
            </div>
            {s < 4 && (
              <div
                className={`h-0.5 w-8 ${
                  step > s ? "bg-green-300" : "bg-muted"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Step 1: Basic Info */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="What's happening in Rajkot?"
                  {...register("title")}
                />
                {errors.title && (
                  <p className="text-xs text-red-500">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Category</Label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <Badge
                      key={cat}
                      variant="outline"
                      className={`cursor-pointer text-sm px-3 py-1.5 ${
                        watchedCategory === cat
                          ? categoryColors[cat] + " ring-2 ring-offset-1"
                          : "hover:bg-muted"
                      }`}
                      onClick={() => setValue("category", cat)}
                    >
                      {categoryLabels[cat]}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  placeholder="Share details about the event, food spot, match, or anything interesting..."
                  rows={6}
                  {...register("content")}
                />
                {errors.content && (
                  <p className="text-xs text-red-500">
                    {errors.content.message}
                  </p>
                )}
              </div>

              <div className="flex justify-end">
                <Button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={!watchedTitle || !watchedContent}
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Image (Required) */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Add Image
                <span className="text-xs text-red-500 font-normal">
                  *required
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              {!imagePreview ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-colors"
                >
                  <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                  <p className="text-sm font-medium">
                    Click to upload an image
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    JPG, PNG, GIF, WebP — max 10MB
                  </p>
                </div>
              ) : (
                <div className="relative rounded-lg overflow-hidden border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-56 object-cover"
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      className="h-8 shadow"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Change
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      className="h-8 shadow"
                      onClick={removeImage}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  {imageFile && (
                    <div className="p-2 bg-muted/80 text-xs text-muted-foreground">
                      {imageFile.name} ({(imageFile.size / 1024).toFixed(0)} KB)
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back
                </Button>
                <Button
                  type="button"
                  onClick={() => setStep(3)}
                  disabled={!imagePreview}
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Location */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-red-500" />
                Add Location (Optional)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Location Name</Label>
                  <Input
                    placeholder="e.g. Racecourse Ground"
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Full Address</Label>
                  <Input
                    placeholder="e.g. Racecourse Ring Road, Rajkot"
                    value={locationAddress}
                    onChange={(e) => setLocationAddress(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleFindOnMap}
                  disabled={
                    searchingLocation || (!locationName && !locationAddress)
                  }
                >
                  {searchingLocation ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-1" />
                  ) : (
                    <Search className="h-4 w-4 mr-1" />
                  )}
                  Find on Map
                </Button>
                {(lat || locationName) && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={clearLocation}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Clear Location
                  </Button>
                )}
              </div>

              <p className="text-xs text-muted-foreground">
                Click on the map to drop a pin, or type an address and click
                &quot;Find on Map&quot;
              </p>

              <MapPicker
                initialLat={lat || undefined}
                initialLng={lng || undefined}
                onLocationChange={handleLocationChange}
              />

              {lat && lng && (
                <p className="text-xs text-muted-foreground">
                  📍 Coordinates: {lat.toFixed(4)}, {lng.toFixed(4)}
                </p>
              )}

              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(2)}
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back
                </Button>
                <Button type="button" onClick={() => setStep(4)}>
                  Next
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Preview & Submit */}
        {step === 4 && (
          <Card>
            <CardHeader>
              <CardTitle>Preview & Submit</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border rounded-lg p-4 space-y-3">
                {watchedCategory && (
                  <Badge
                    variant="outline"
                    className={categoryColors[watchedCategory as PostCategory]}
                  >
                    {categoryLabels[watchedCategory as PostCategory]}
                  </Badge>
                )}
                <h2 className="text-xl font-bold">{watchedTitle}</h2>
                {imagePreview && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded"
                  />
                )}
                <p className="text-sm whitespace-pre-wrap">{watchedContent}</p>
                {locationName && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5 text-red-500" />
                    {locationName}
                    {locationAddress && ` — ${locationAddress}`}
                  </div>
                )}
              </div>

              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(3)}
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-1" />
                  ) : (
                    <Check className="h-4 w-4 mr-1" />
                  )}
                  Publish Post
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </form>
    </div>
  );
}
