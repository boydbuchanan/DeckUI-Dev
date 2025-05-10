import { useCallback, useState, useMemo, useEffect } from "react";
import * as CMS from "@deckai/client/types/cms";
import {
  Text,
  Button,
  useToast,
  ProgressBar,
  AddWorkCard,
  WorkCard,
  Accordion
} from "@deckai/deck-ui";
import Me from "@me";
import { EditWorkSidebar } from "@deckai/client/features/profile/EditWorkSidebar";

type EditWorkProps = {
  userInterests: CMS.Interest[];
  categories?: CMS.Category[];
  onWorkUpdate?: () => void;
};

export function EditWork({
  userInterests,
  categories,
  onWorkUpdate
}: EditWorkProps) {
  const { show } = useToast();
  const showStorage = false;

  // State for storage
  const storageUsed = 10; // TODO: Get from backend
  const storageTotal = 50; // GB
  const storagePercentage = (storageUsed / storageTotal) * 100;
  const [works, setWorks] = useState<CMS.Work[] | undefined>(undefined);
  
  useEffect(() => {
    if (!works || works.length === 0) {
      refreshWorks();
    }
  }, [works]);
  const refreshWorks = () => {
    console.log("handleWorkChange called");
    Me.works()
        .then((fetched) => setWorks(fetched))
        .catch((error) => console.error("Failed to fetch works:", error));
  }
  
  const [unCategorizedWork, setUnOrganizedWorks] = useState<
    CMS.Work[] | undefined
  >(undefined);
  const [otherWorkInterests, setOtherWorkInterests] = useState<
    CMS.Interest[] | undefined
  >(undefined);

  const currentInterestIds: number[] = useMemo(() => {
    return userInterests ? userInterests.map((i) => i.id) : [];
  }, [userInterests]);

  const allWorkInterests: CMS.Interest[] = useMemo(() => {
    var myWorks = works || [];
    var uncatWork =
      myWorks &&
      myWorks.filter((work) => !work.interest || work.interest == null);
    setUnOrganizedWorks(uncatWork);

    setOtherWorkInterests(
      myWorks
        ? myWorks
            .filter(
              (work) =>
                work.interest != null &&
                !currentInterestIds?.some(
                  (intId) => intId === work.interest!.id
                )
            )
            .map((work) => work.interest as CMS.Interest)
        : []
    );

    let myWorksInterests: CMS.Interest[] = myWorks
      .filter((work) => work.interest != null)
      .map((work) => work.interest as CMS.Interest);

    // Deduplicate the list
    myWorksInterests = myWorksInterests.filter(
      (item, index) =>
        myWorksInterests.findIndex((item2) => item2.id === item.id) === index
    );

    const combinedList = [
      ...(userInterests || []),
      ...myWorksInterests.filter(
        (item2) => !(userInterests || []).some((item1) => item1.id === item2.id)
      )
    ];

    return combinedList || [];
  }, [currentInterestIds, userInterests, works]);

  const [editWork, setEditWork] = useState<CMS.Work | undefined>(undefined);
  const [isUploadSidebarOpen, setIsUploadSidebarOpen] = useState(false);
  const [selectedInterest, setSelectedInterest] = useState<CMS.Interest | null>(
    null
  );
  const handleSidebarClose = useCallback(() => {
    setIsUploadSidebarOpen(false);
    setSelectedInterest(null);
  }, []);

  const handleWorkClick = (work: CMS.Work) => {
    setEditWork(work);
    setSelectedInterest(work.interest || null);
    setIsUploadSidebarOpen(true);
  };
  // const handleAddWorkClick = useCallback((interest?: CMS.Interest) => {
  const handleAddWorkClick = (interest?: CMS.Interest) => {
    console.log("Add work clicked for interest", interest);
    setEditWork(undefined);
    setSelectedInterest(interest || null);
    setIsUploadSidebarOpen(true);
  };

  
  const handleSaveWork = async (
    documentId?: string | undefined,
    workProperties?: CMS.UpdateWork
  ) => {
    try {
      var response;
      if (!documentId) {
        response = await Me.newWorkWith(workProperties);
        var work = response.data as CMS.Work;
        documentId = work.documentId;
      } else {
        response = await Me.updateMyWork(documentId, workProperties);
      }

      if (response.status === 200 || response.status === 201) {
        console.log("Work updated", response);
        onWorkUpdate?.();
        return response.data as CMS.Work;
      } else {
        console.error("Failed to update work", response);
        alert("Failed to update work");
        return null;
      }
    } catch (error) {
      console.error("Failed to save work", error);
    }
    return null;
  };

  return (
    <>
      <div className="flex flex-col h-full">
        <div className="flex flex-col gap-6 pt-8 flex-1 overflow-y-auto pb-4">
          {/* Storage */}
          {showStorage && (
            <div className="flex flex-col gap-2 border border-background-50 rounded-md p-4">
              <div className="flex justify-between">
                <Text variant="body-default-semibold">Storage</Text>
                <Text variant="body-lg-semibold">{storagePercentage}%</Text>
              </div>
              <ProgressBar
                value={storagePercentage}
                startLabel={`${storageUsed} GB used`}
                endLabel={`${storageTotal} GB total`}
              />
            </div>
          )}

          {/* If no work and no un categorized work */}
          {((!works || works.length === 0) &&
            (!allWorkInterests || allWorkInterests.length === 0) && (
              <div className="flex flex-col gap-1">
                <Text variant="body-md">No works uploaded yet</Text>
                <Text variant="label-default" color="secondary">
                  Get started by uploading your work
                </Text>
                <div className="flex flex-wrap gap-1">
                  <div className="flex-none">
                    <AddWorkCard
                      onClick={() => handleAddWorkClick()}
                      className="!sm:w-[117px] !sm:h-[186px] !w-[117px] !h-[186px]"
                    />
                  </div>
                </div>
              </div>
            )) || (
            <div className="flex flex-col gap-1">
              <Text variant="body-md">Upload Work</Text>
              <Text variant="label-default" color="secondary">
                Reorder by dragging content around.
              </Text>
            </div>
          )}

          {/* Work Categories */}
          {allWorkInterests &&
            allWorkInterests.map((interest) => (
              <Accordion
                key={interest.Display}
                type="multiple"
                defaultValue={[interest.Display]}
                items={[
                  {
                    title: interest.Display,
                    value: interest.Display,
                    content: (
                      <div className="flex flex-wrap gap-1">
                        <AddWorkCard
                          onClick={() => handleAddWorkClick(interest)}
                          className="!sm:w-[117px] !sm:h-[186px] !w-[117px] !h-[186px]"
                        />
                        {works &&
                          works
                            .filter((work) => work.interest?.id === interest.id)
                            .map((work) => (
                              <WorkCard
                                iconName={
                                  work.Platform === "Instagram"
                                    ? "instagram-filled"
                                    : work.Platform === "Youtube"
                                      ? "youtube-filled"
                                      : "tiktok-filled"
                                }
                                caption={work.Title}
                                backgroundImage={work.DisplayImage?.url ?? ""}
                                onClick={() => handleWorkClick(work)}
                                key={work.id}
                                className="!sm:w-[117px] !sm:h-[186px] !w-[117px] !h-[186px]"
                              />
                            ))}
                      </div>
                    )
                  }
                ]}
              />
            ))}
          {/* Uncategorized Works */}
          {unCategorizedWork && unCategorizedWork.length > 0 && (
            <Accordion
              type="multiple"
              defaultValue={["Uncategorized"]}
              items={[
                {
                  title: "Uncategorized",
                  value: "Uncategorized",
                  content: (
                    <div className="flex flex-wrap gap-1">
                      <AddWorkCard
                        onClick={() => handleAddWorkClick()}
                        className="!sm:w-[117px] !sm:h-[186px] !w-[117px] !h-[186px]"
                      />
                      {unCategorizedWork.map((work) => (
                        <WorkCard
                          iconName={
                            work.Platform === "Instagram"
                              ? "instagram-filled"
                              : work.Platform === "Youtube"
                                ? "youtube-filled"
                                : "tiktok-filled"
                          }
                          caption={work.Title}
                          backgroundImage={work.DisplayImage?.url ?? ""}
                          onClick={() => handleWorkClick(work)}
                          key={work.id}
                          className="!sm:w-[117px] !sm:h-[186px] !w-[117px] !h-[186px]"
                        />
                      ))}
                    </div>
                  )
                }
              ]}
            />
          )}
        </div>
      </div>
      {isUploadSidebarOpen && (
        <EditWorkSidebar
          open={isUploadSidebarOpen}
          onClose={handleSidebarClose}
          options={categories}
          work={editWork}
          newInterest={selectedInterest}
          handleSaveWork={handleSaveWork}
          onWorkUpdate={() => {
            onWorkUpdate?.();
            refreshWorks();
          }}
        />
      )}
    </>
  );
}
