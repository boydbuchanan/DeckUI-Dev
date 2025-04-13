import { useCallback, useState, useMemo } from "react";
import * as CMS from "@deckai/client/types/cms";
import { EditProfileTabs } from "./ProfileEditor";
import {
  Text,
  Button,
  useToast,
  ProgressBar,
  AddWorkCard,
  WorkCard,
  Accordion
} from "@deckai/deck-ui";
import { EditWorkSidebar } from "./EditWorkSidebar";

type EditWorkProps = {
  userInterests: CMS.Interest[];
  userWorks?: CMS.Work[];
  handleWorkClick: (work: CMS.Work) => void;
  handleAddWorkClick: (interest?: CMS.Interest) => void;
};

export function EditWork({
  userInterests,
  userWorks,
  handleWorkClick,
  handleAddWorkClick
}: EditWorkProps) {
  const { show } = useToast();
  const showStorage = false;

  // State for upload sidebar
  const [isUploadSidebarOpen, setIsUploadSidebarOpen] = useState(false);
  const [selectedInterest, setSelectedInterest] = useState<CMS.Interest | null>(
    null
  );

  // State for storage
  const storageUsed = 10; // TODO: Get from backend
  const storageTotal = 50; // GB
  const storagePercentage = (storageUsed / storageTotal) * 100;

  const [works, setWorks] = useState<CMS.Work[] | undefined>(userWorks);
  const [editWork, setEditWork] = useState<CMS.Work | undefined>(undefined);

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

    //setAllWorkInterests(combinedList);

    return combinedList || [];
  }, [currentInterestIds, userInterests, works]);

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

        {/* Save Button */}
        {/* <div className="sticky bottom-0 left-0 right-0 px-4 pb-4 pt-0.5 bg-white">
          <Button
            color="black"
            variant="filled"
            onClick={handleSaveChanges}
            className="w-full py-4"
          >
            Save changes
          </Button>
        </div> */}
      </div>

      {/* Upload Work Sidebar */}
      {/* {(isUploadSidebarOpen && (
      <EditWorkSidebar
        open={isUploadSidebarOpen}
        onClose={handleSidebarClose}
        options={categories}
        work={editWork}
        newInterest={selectedInterest}
        handleSaveWork={handleSaveWork}
      />
      ))} */}
    </>
  );
}
