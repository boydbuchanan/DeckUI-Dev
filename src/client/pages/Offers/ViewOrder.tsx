"use client";

import React, { useCallback, useEffect, useState } from "react";

import { SessionData } from "@deckai/client/types/session";
import Me from "@me";
import { Text, Button, useToast, OrderSummary, ProgressBar, Icon, Tag } from "@deckai/deck-ui";
import { Offer, Order, OrderState, UpdateOrder, Upload, User } from "@deckai/client/types/cms";
import { Progress, ProgressStep, ProgressStepStatus } from "@deckai/client/features/offer/Progress";
import Summary from "@deckai/client/features/offer/Summary";
import { capitalizeFirstLetter, capitalizeWords, formatPrice, formatToReadableString, formatEnum, formatFileSize, formatFileSizeString } from "@deckai/client/utils";

import Api from "@api";
import { PageLayout } from "@deckai/client/layout/PageLayout";
import FileDrop from "@deckai/client/components/DragonUpload/FileDrop";
import { MediaInfo } from "@deckai/client/types";
import { ContentViewer } from "@deckai/client/components/ContentViewer";
import { MediaCard } from "@deckai/client/components/Media";
import { formatDistance } from 'date-fns';

// const Stripe = loadStripe(Config.STRIPE_PUBLIC_KEY);

type ContentFile = {
  file: File;
  progress: number;
  mediaInfo?: MediaInfo;
  dataUrl: string;
};

const calculateWorkTime = (order: Order) => {
  var finishedAt = order.inReviewAt ? new Date(order.inReviewAt) : new Date();
  var workTime = order.inReviewAt ? new Date(order.inReviewAt) : new Date();
  
  workTime.setSeconds(workTime.getSeconds() - order.totalWorkTime);
  
  return {workTime, finishedAt};
}

export default function ViewOrder({ session, order }: { 
  session: SessionData,
  order: Order;
}) {
  
  const [isLoading, setIsLoading] = useState(false);
  const [asCreator, setAsCreator] = useState(session.Auth!.user!.id === order!.creator!.id);
  
  const [startDistance, setWorkTime] = useState<string>(() => {
    var workTimes = calculateWorkTime(order);
    return `${formatDistance(workTimes.workTime, workTimes.finishedAt)}`;
  });

  const [orderState, setOrderState] = useState<OrderState>(order.State);
  const [documentId, setDocumentId] = useState<string | undefined>(order!.documentId);

  const [videoPlayerOpen, setVideoPlayerOpen] = useState(false);
  const [viewContent, setViewContent] = useState<ContentViewerData | undefined>(undefined);
  
  const updateState = async (orderState: OrderState) => {
    setIsLoading(true);
    try {
      var response;
      var updateData: UpdateOrder = {
        State: orderState,
      }
      response = await Me.updateOrder(documentId, updateData);

      if (response.status === 200 || response.status === 201) {
        console.log("offer updated", response);
        setOrderState(orderState);
        return;
      } else {
        console.error("Failed to update offer", response);
        alert("Failed to update offer");
        return;
      }
    } catch (error) {
      console.error("Failed to save offer", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const { show } = useToast();
  var stepsComplete = 2;
  switch (orderState) {
    case OrderState.Pending:
    case OrderState.Rejected:
      stepsComplete = 2;
      break;
    case OrderState.InProgress:
      stepsComplete = 3;
      break;
    case OrderState.Submitted:
      stepsComplete = 4;
      break;
    case OrderState.Accepted:
      stepsComplete = 5;
      break;
    case OrderState.Completed:
      stepsComplete = 7;
      break;
  }
  var stepProgress = (stepNumber: number) => {
    if (stepsComplete == stepNumber) return ProgressStepStatus.Current;
    if (stepsComplete > stepNumber) return ProgressStepStatus.Completed;
    return ProgressStepStatus.Pending;
  }

  useEffect(() => {
    // Update the startDistance every second
    const interval = setInterval(() => {
      var workTimes = calculateWorkTime(order);
      setWorkTime(`${formatDistance(workTimes.workTime, workTimes.finishedAt)}`);
    }, 1000);

    // Cleanup the interval on component unmount
    return () => clearInterval(interval);
  }, [order.firstStartedAt, order.completedAt]);

  var ProgressSteps: ProgressStep[] = [
    { title: "Offer Made", status: ProgressStepStatus.Completed, icon: "user", description: "Offer Details made by creator" },
    { title: "Purchase", status: ProgressStepStatus.Completed, icon: "card", description: "Review offer and complete payment" },
    { title: "Pending", status: stepProgress(2), icon: "edit", description: "Your order is in the Creators Queue" },
    { title: `In Progress`, status: stepProgress(3), icon: "edit", description: "Creator is working on your order" },
    { title: "Review Work", status: stepProgress(4), icon: "eye", description: "Work is awaiting review or feedback" },
    { title: "Accepted", status: stepProgress(5), icon: "swoosh", description: "Work has been approved" },
    { title: "Completed", status:stepProgress(6), icon: "star-filled", description: "All work has been completed" },
  ];

  var ProgressHeader: ProgressStep = {
    title: "Estimated Delivery " + order.Delivery,
    description: "Complete these steps and create your first offer",
    status: ProgressSteps.some((step) => step.status !== ProgressStepStatus.Completed) ? ProgressStepStatus.Pending : ProgressStepStatus.Completed,
    icon: "truck-time"
  };
  
  const [files, setFiles] = useState<Record<string, ContentFile>>({});
  
  const [uploads, setUploads] = useState<Upload[] | undefined>(
    order.Content || undefined
  );
  const [contentHover, setContentHover] = useState<boolean>(false);
  const onContentFilesSelected = async (files: File[]) => {
    setContentHover(false);

    // update content files state
    setFiles((prev) => {
      const updated = { ...prev };
      files.forEach((file) => {
        if (!updated[file.name]) {
          updated[file.name] = {
            file: file,
            progress: 0,
            dataUrl: URL.createObjectURL(file),
          };
        }
      });
      return updated;
    });
  };

  
  const handleWorkContentUpload = async () => {
    if (!files || Object.keys(files).length === 0) return;

    // Create an array of upload promises
    const uploadPromises = Object.entries(files).map(async ([key, contentFile]) => {
      const file = contentFile.file;
      const contentSize = contentFile.mediaInfo;
      console.log("Uploading Content File", key);

      const ext = file.name.split(".").pop();
      const contentfileData = {
        alternativeText: file.name,
        caption: file.size,
        height: contentSize?.height,
        width: contentSize?.width,
        ext,
      };

      try {
        const contentUploadResponse = await Me.uploadOrderContent(
          file,
          order,
          undefined,
          contentfileData,
          (progress: number) => {
            setFiles((prev) => {
              return {
                ...prev,
                [file.name]: {
                  ...prev[file.name],
                  progress: progress,
                },
              };
            });
          }
        );

        if (contentUploadResponse.status === 200) {
          console.log("Content Uploaded", contentUploadResponse);
          return true;
        } else {
          console.error("Failed to upload content", contentUploadResponse);
          return false;
        }
      } catch (error) {
        console.error("Failed to upload content", error);
        return false;
      }
    });

    // Wait for all uploads to complete
    const results = await Promise.all(uploadPromises);

    // Check if all uploads were successful
    const allSuccessful = results.every((result) => result === true);

    if (allSuccessful) {
      console.log("All uploads completed successfully");
      // Refresh the page or perform any other action
      window.location.reload();
    } else {
      console.error("Some uploads failed");
      // Handle failed uploads (e.g., show an error message)
    }
  };

  const handleContentDelete = async (
    contentUpload: Upload,
  ) => {
    var contentUploadId = contentUpload?.id || undefined;
    if (contentUploadId) {
      try {
        console.log("Delete Previous Content", contentUploadId);
        var deleteResponse = await Me.deleteUpload(contentUploadId);
        if (deleteResponse.status === 200) {
          console.log("Content Deleted", deleteResponse);
        } else {
          console.error("Failed to delete content", deleteResponse);
          return false;
        }
      } catch (error) {
        console.warn("Failed to delete content", error);
        return false;
      }
    }
  }

  return (
    <PageLayout
      session={session}
      showBreadcrumbs={false}
    >
      <div className="flex w-full h-full justify-center">
        {/* Left Half */}
        <div className="flex flex-col p-4 justify-between">
          {/* Top Header */}
          <div className="flex w-full p-4">
            <div className="flex flex-col gap-4">
              <Text variant="body-md" color="secondary">
                Your Order for: {order.Title}
              </Text>
              <Text variant="body-xs" color="secondary">
                Here you can review details and updates on the progress of your order.
              </Text>
            </div>
          </div>
          <Summary
            header={`Status: ${formatEnum(orderState, "-", " ")}`}
            title={order.Title}
            description={order.Details}
            formData={{
              Delivery: order.Delivery,
              Purchased: new Date(order.stripeCreatedAt).toLocaleDateString(),
            }}
            footer={{
              Amount: formatPrice(order.Amount),
            }}
            className="min-w-[600px]"
          />
          <div className="flex flex-col gap-4 mt-4">
            {asCreator && (
              <div className="flex flex-col gap-2">
                <Text variant="body-xs" color="secondary">
                  This order was made by {order.buyer?.displayName ?? order.buyer?.id} on {new Date(order.stripeCreatedAt).toLocaleDateString()}
                </Text>
                <Text variant="body-xs" color="secondary">
                  You can contact them at {order.buyer?.email}
                </Text>
              </div>
            )}
            {stepsComplete > 2 && (
              <Text variant="body-xs" color="secondary">
                Order {stepsComplete > 3 ? "delivered in" : "in progress for"} {startDistance} ({order.totalWorkTime}) {order.firstStartedAt && `(${new Date(order.firstStartedAt).toLocaleDateString()})`}
              </Text>
            )}
          </div>
          
          <div className="flex justify-between items-center mt-6">
            {asCreator && orderState === OrderState.Pending && (
              <Button
                className="w-auto mx-auto py-4"
                color="black"
                variant="filled"
                onClick={() => {
                  updateState(OrderState.InProgress);
                }}
              >
                Start Work
              </Button>
            )}
            {asCreator && orderState === OrderState.InProgress && (
              <Button
                className="w-auto mx-auto py-4"
                color="accent"
                variant="filled"
                onClick={() => {
                  updateState(OrderState.Submitted);
                }}
              >
                Submit For Review
              </Button>
            )}
            
            {asCreator && (orderState === OrderState.Rejected || orderState === OrderState.Submitted) && (
              <Button
                className="w-auto mx-auto py-4 text-red-500 border-red-500"
                color="accent"
                variant="outlined"
                onClick={() => {
                  updateState(OrderState.InProgress);
                }}
              >
                Edit Order Work
              </Button>
            )}
            
            {asCreator && (orderState === OrderState.Accepted) && (
              <Button
                className="w-auto mx-auto py-4"
                color="black"
                variant="outlined"
                onClick={() => {
                  updateState(OrderState.Completed);
                }}
              >
                Complete Order
              </Button>
            )}

            {!asCreator && orderState === OrderState.Submitted && (
              <Button
                className="w-auto mx-auto py-4 text-red-500 border-red-500"
                variant="outlined"
                onClick={() => {
                  updateState(OrderState.Rejected);
                }}
              >
                Reject Work
              </Button>
            )}
            {!asCreator && (orderState === OrderState.Rejected || orderState === OrderState.Submitted) && (
              <Button
                className="w-auto mx-auto py-4"
                color="accent"
                variant="filled"
                onClick={() => {
                  updateState(OrderState.Accepted);
                }}
              >
                Accept Work
              </Button>
            )}
          </div>
        </div>

        {/* Right Half */}
        <div className="flex p-4">
          <Progress header={ProgressHeader} steps={ProgressSteps} />
        </div>
      </div>
      {/* Bottom Actions */}
      <div className="flex w-full h-full justify-center border-2 border rounded-lg bg-background-50">
        
        {/* Uploaded Half */}
        <div className="flex flex-grow flex-col gap-2 px-2">
          <div className="flex flex-col gap-2 p-4 items-center">
            <Text variant="body-md">Uploaded Work</Text>
            <Text variant="label-default" color="secondary">
              Click to review or download work
            </Text>
          </div>
          
          <div className={`flex flex-col items-center justify-center p-8`}>
            {uploads && uploads.length > 0 && (
              <div className="container m-auto flex flex-row gap-2 justify-center">
                  {uploads.map((upload) => (
                    <div
                      key={upload.id}
                      className=""
                    >
                    <div
                      className="pb-2 flex flex-col justify-center items-center cursor-pointer gap-4 rounded-lg"
                      onClick={() => {
                        setViewContent({
                          src: upload.url,
                          caption: upload.alternativeText,
                          mimeType: upload.mime,
                        });
                        setVideoPlayerOpen(true);
                      }}
                    >
                      <Text variant="body-md">{new Date(upload.updatedAt).toLocaleDateString()}</Text>
                      <MediaCard
                        src={upload.url}
                        mimeType={upload.mime}
                        caption={upload.alternativeText}
                        iconName={upload.mime.includes("video") ? "video" : "image"}
                        tags={[formatFileSizeString(upload.caption)]}
                      />
                    </div>
                    {asCreator && stepsComplete < 4 && (
                      <Button
                        variant="outlined"
                        className="w-full bg-red-500 text-white"
                        onClick={async () => {
                          await handleContentDelete(upload);
                          setUploads((prev) => {
                            return prev?.filter((item) => item.id !== upload.id);
                          });
                        }}
                      >
                        Delete
                      </Button>
                    )}
                      
                    <Button
                      variant="filled"
                      color="accent"
                      className="w-full text-white my-2"
                      onClick={() => {
                        const link = document.createElement("a");
                        link.href = `/api/download?uploadId=${upload.id}`; // Use the proxy API
                        link.setAttribute("download", upload.alternativeText || "file"); // Set the filename
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }}
                    >
                      Download
                    </Button>
                  </div>
                  ))}
              </div>
            ) || (
              <div className="flex flex-col items-center gap-2">
                <Text variant="body-lg-semibold">No files uploaded</Text>
              </div>
            )}
          </div>
        </div>
        {/* Upload Work */}
        {asCreator && orderState === OrderState.InProgress && (
        
        <div className="flex flex-grow flex-col gap-2 px-2">
          
          <div className="flex flex-col gap-2 p-4 items-center">
            <Text variant="body-md">Upload file</Text>
            <Text variant="label-default" color="secondary">
              Supported video file formats: mp4, MOV, WMV, WEBM
            </Text>
            <FileDrop
              onFilesSelected={onContentFilesSelected}
              multiple={true}
              fileTypes={["image/*", "video/*"]}
              maxSizeMB={100}
              onDragOver={(event) => {
                event.preventDefault();
                setContentHover(true);
              }}
              onDragLeave={(event) => {
                event.preventDefault();
                setContentHover(false);
              }}
            >
              <div
                className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg ${contentHover ? "bg-secondary-400" : ""} border-primary-${contentHover ? 100 : 500} transition-colors cursor-pointer`}
              >
                <p className="text-lg font-medium">
                  Drag and drop your file here
                </p>
                <p className="text-sm text-gray-500">or click to browse</p>
              </div>
            </FileDrop>
          </div>
        
          
          <div className="flex flex-col items-center justify-center p-8">
            {files && Object.keys(files).length > 0 && (
              <div key='tilegrid' 
                className="container m-auto flex flex-row gap-2 justify-center"
              >
                {Object.values(files).map((selected) => (
                  <div
                    key={selected.file.name}
                    className=""
                  >
                    <div className="pb-2 flex flex-col justify-center items-center cursor-pointer gap-4 rounded-lg">
                      <ProgressBar
                        value={selected.progress || 1}
                        className="w-40 border-2  rounded-lg"
                      />
                      <MediaCard
                        src={selected.dataUrl}
                        mimeType={selected.file.type}
                        caption={selected.file.name}
                        tags={[formatFileSize(selected.file.size)]}
                        iconName={selected.file.type.includes("video") ? "video" : "image"}
                        onLoadedMedia={(mediaInfo) => {
                          setFiles((prev) => {
                            return {
                              ...prev,
                              [selected.file.name]: {
                                ...prev[selected.file.name],
                                mediaInfo: mediaInfo,
                              },
                            };
                          });
                        }
                        }
                        onClick={() => {
                          var contentFile = files[selected.file.name];
                          setViewContent({
                            src: contentFile.dataUrl,
                            caption: selected.file.name,
                            mimeType: selected.file.type,
                          });
                          setVideoPlayerOpen(true);
                        }}
                        
                      >
                        <Button
                          color="accent"
                          variant="filled"
                          className="!px-3 !py-3 z-20 bg-red-500 "
                          onClick={async () => {
                            // remove from content files
                            setFiles((prev) => {
                              const updated = { ...prev };
                              delete updated[selected.file.name];
                              return updated;
                            });
                            
                          }}
                        >
                          <Icon name="trash" color="white" />
                        </Button>
                        
                      </MediaCard>
                      <Button
                        variant="outlined"
                        className="w-full bg-red-500 text-white"
                        onClick={async () => {
                          // remove from content files
                          setFiles((prev) => {
                            const updated = { ...prev };
                            delete updated[selected.file.name];
                            return updated;
                          });
                        }}
                      >
                        Delete
                      </Button>
                        
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex justify-between items-center mt-6">
              <Button
                className="w-auto mx-auto py-4"
                color="accent"
                variant="filled"
                disabled={isLoading || !files || Object.keys(files).length === 0}
                onClick={() => handleWorkContentUpload()}
              >
                {isLoading ? 'Processing...' : 'Upload'}
              </Button>
            </div>
          </div>
        </div>
        )}
        
      </div>
      {viewContent && videoPlayerOpen && (
        <ContentViewer
          open={videoPlayerOpen}
          onClose={() => setVideoPlayerOpen(false)}
          src={viewContent.src}
          caption={viewContent.caption}
          mimeType={viewContent.mimeType}
          autoPlay={true}
        />
      )}
    </PageLayout>
  );
}
type ContentViewerData = {
  src: string;
  caption?: string;
  mimeType?: string;
}

