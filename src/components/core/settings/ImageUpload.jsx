import { useState } from "react";
import ImageAvatar from "../../common/ImageAvatar";
import { useMutation } from "@tanstack/react-query";
import { apiConnector } from "../../../services/apiConnector";
import { REMOVE_PROFILE_PIC, UPLOAD_PROFILE_PIC } from "../../../services/apis";
import { toast } from "react-hot-toast";
import { useProfile } from "../../../services/queryFunctions/profile";

export default function ImageUpload() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const { data, refetch } = useProfile();

  const userData = data?.data?.data?.user;

  // keep track of image change
  const handleImageChange = (e) => {
    e.preventDefault();
    if (e.target.files.length) {
      let reader = new FileReader();
      let file = e.target.files[0];
      reader.onloadend = () => {
        setImage(file);
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // muation for uploading image
  const imageUploadMutation = useMutation({
    mutationFn: (payload) => {
      return apiConnector("PUT", UPLOAD_PROFILE_PIC, payload, {
        "Content-Type": "multipart/form-data",
      });
    },
    onSuccess: () => {
      toast.success("Image uploaded successfully!");
      setImage(null);
      setPreview(null);
      refetch();
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Something went wrong!");
    },
  });

  // mutation for removing image
  const imageRemoveMutation = useMutation({
    mutationFn: () => {
      return apiConnector("PUT", REMOVE_PROFILE_PIC);
    },
    onSuccess: () => {
      toast.success("Image removed successfully!");
      setImage(null);
      setPreview(null);
      refetch();
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Something went wrong!");
    },
  });

  // handle image upload
  const handleImageUpload = () => {
    const formData = new FormData();
    formData.append("profileImage", image);
    imageUploadMutation.mutate(formData);
  };

  // handle image remove
  const handleImageRemove = () => {
    imageRemoveMutation.mutate();
  };

  return (
    <div className="card md:w-[600px] bg-neutral text-neutral-content p-10 md:px-20 flex items-center space-y-10">
      <div className="w-36 h-36 rounded-full overflow-hidden">
        <ImageAvatar preview={preview} />
      </div>
      <div className="flex-1 flex justify-center items-center gap-x-5 gap-y-5 flex-wrap">
        {image ? (
          <>
            <button
              disabled={
                imageUploadMutation.isLoading || imageRemoveMutation.isLoading
              }
              className="btn btn-primary"
              onClick={handleImageUpload}
            >
              {imageUploadMutation.isLoading || imageRemoveMutation.isLoading
                ? "Loading..."
                : "Upload"}
            </button>
            <button
              onClick={() => {
                setImage(null);
                setPreview(null);
              }}
              disabled={
                imageUploadMutation.isLoading || imageRemoveMutation.isLoading
              }
              className="btn"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <input
              type="file"
              accept="image/png, image/jpg, image/jpeg"
              onChange={handleImageChange}
              disabled={
                imageUploadMutation.isLoading || imageRemoveMutation.isLoading
              }
              className="file-input file-input-bordered file-input-primary w-full max-w-xs"
            />
            {userData?.profileImage && (
              <button
                title="Remove Profile Picture"
                onClick={handleImageRemove}
                disabled={
                  imageUploadMutation.isLoading || imageRemoveMutation.isLoading
                }
                className="btn"
              >
                {imageUploadMutation.isLoading || imageRemoveMutation.isLoading
                  ? "Loading..."
                  : "Remove"}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
