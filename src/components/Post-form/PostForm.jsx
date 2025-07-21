import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, RTE, Select } from "..";
import appwriteService from "../../appwrite/config";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PostForm({ post }) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    getValues,
  } = useForm({
    defaultValues: {
      title: post?.title || "",
      slug: post?.$id || "",
      content: post?.content || "",
      status: post?.status || "active",
    },
  });

  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);

  const [previewImage, setPreviewImage] = useState(
    post?.featuredImage
      ? appwriteService.getFilePreview(post.featuredImage)
      : null
  );

  const submit = async (data) => {
    if (post) {
      const file = data.image[0]
        ? await appwriteService.uploadFile(data.image[0])
        : null;

      if (file) appwriteService.deleteFile(post.featuredImage);

      const dbPost = await appwriteService.updatePost(post.$id, {
        ...data,
        featuredImage: file ? file.$id : undefined,
      });

      if (dbPost) navigate(`/post/${dbPost.$id}`);
    } else {
      const file = await appwriteService.uploadFile(data.image[0]);

      if (file) {
        data.featuredImage = file.$id;
        const dbPost = await appwriteService.createPost({
          ...data,
          userId: userData.$id,
        });
        if (dbPost) navigate(`/post/${dbPost.$id}`);
      }
    }
  };

  const slugTransform = useCallback((value) => {
    if (value && typeof value === "string")
      return value
        .trim()
        .toLowerCase()
        .replace(/[^a-zA-Z\d\s]+/g, "-")
        .replace(/\s+/g, "-");
    return "";
  }, []);

  useEffect(() => {
    const sub = watch((value, { name }) => {
      if (name === "title") {
        setValue("slug", slugTransform(value.title), {
          shouldValidate: true,
        });
      }

      // ✅ Show image preview instantly
      if (name === "image" && value.image?.[0]) {
        const localUrl = URL.createObjectURL(value.image[0]);
        setPreviewImage(localUrl);
      }
    });

    return () => sub.unsubscribe();
  }, [watch, slugTransform, setValue]);

  return (
    <form
      onSubmit={handleSubmit(submit)}
      className="mx-auto max-w-4xl space-y-6"
    >
      {/* Title + Slug */}
      <Input
        label="Title :"
        placeholder="Title"
        {...register("title", { required: true })}
      />

      <Input
        label="Slug :"
        placeholder="Slug"
        {...register("slug", { required: true })}
        onInput={(e) =>
          setValue("slug", slugTransform(e.currentTarget.value), {
            shouldValidate: true,
          })
        }
      />
      <div className="space-y-4">
        <Input
          label="Featured Image :"
          type="file"
          accept="image/png, image/jpg, image/jpeg, image/gif"
          {...register("image", { required: !post })}
        />

        {previewImage && (
          <img
            src={previewImage}
            alt="Preview"
            className="w-full rounded-lg shadow"
          />
        )}
      {/* Rich text editor */}
      <RTE
        label="Content :"
        name="content"
        control={control}
        defaultValue={getValues("content")}
      />

      {/* Image upload + preview + status + submit */}
      

        <Select
          options={["active", "inactive"]}
          label="Status :"
          {...register("status", { required: true })}
        />

        <Button
          type="submit"
          bgColor={post ? "bg-green-500" : undefined}
          className="w-half"
        >
          {post ? "Update" : "Submit"}
        </Button>
      </div>
    </form>
  );
}
