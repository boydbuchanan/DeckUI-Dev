import React, {
  useCallback,
  useMemo,
  useState
} from "react";
import {
  Sidebar,
  Input,
  Button,
  Text,
  TextArea,
  cn,
  SlideButton,
} from "@deckai/deck-ui";
import * as CMS from "@deckai/client/types/cms";
import Me from "@me";
import Summary from "./Summary";
import { formatPrice } from "@deckai/client/utils";
import { oneMonthFromNow } from "@deckai/client";

type EditOfferSidebarProps = {
  open: boolean;
  onClose: () => void;
  entity: CMS.Offer | undefined;
  canEnableOffer: boolean;
  onChange: (offer: CMS.Offer) => void;
};

export const EditOfferSidebar: React.FC<EditOfferSidebarProps> = ({
  open,
  onClose,
  entity,
  canEnableOffer,
  onChange
}) => {
  // Interest
  const [documentId, setDocumentId] = useState<string | undefined>(entity?.documentId);
  const [inReview, setInReview] = useState<boolean>(false);
  const [editLocked, setEditLocked] = useState<boolean>(entity?.State === CMS.OfferState.Enabled);
  
  const editWork = useMemo(() => {
    setDocumentId(entity?.documentId);
    
    return entity || new CMS.Offer();
  }, [entity, open]);

  // Error state
  const [urlError, setUrlError] = useState<string | undefined>(undefined);

  // Form state
  var updateData: CMS.UpdateOffer = useMemo(() => {
  return {
    Title: editWork.Title,
    Details: editWork.Details,
    Delivery: editWork.Delivery,
    Amount: editWork.Amount,
    ForEmail: editWork.ForEmail,
    Expires: editWork.Expires || oneMonthFromNow(),
    creator: editWork.creator?.id,
    buyer: editWork.buyer?.id,
  }}, [editWork]);

  const [formData, setFormData] = useState(updateData);

  const onInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    []
  );
  const onTextAreaChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const { name, value } = event.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    []
  );
  
  const onReviewClicked = async () => {
    setInReview(true);
    if (formData.ForEmail) {
      formData.Type = CMS.OfferType.Private;
      return;
    }
  }
  
  const onReviseClicked = async () => {
    setInReview(false);
  }

  const onSave = async () => {
    try {
      var response;
      if (!documentId) {
        formData.State = CMS.OfferState.Unavailable;
        var newData = { ...formData,
          State: CMS.OfferState.Unavailable,
        }
        
        response = await Me.newOfferWith(newData);
        var work = response.data as CMS.Offer;
        setDocumentId(work.documentId);
      } else {
        response = await Me.updateOffer(documentId, formData);
      }

      if (response.status === 200 || response.status === 201) {
        console.log("offer updated", response);
        onChange(response.data as CMS.Offer);
        return;
      } else {
        console.error("Failed to update offer", response);
        alert("Failed to update offer");
        return;
      }
    } catch (error) {
      console.error("Failed to save offer", error);
    }
  };
  

  const onConfirm = async () => {
    
    var confirmOffer = { ...formData,
      State: CMS.OfferState.Enabled,
    }

    try {
      var response;
      if (!documentId) {
        response = await Me.newOfferWith(confirmOffer);
        var work = response.data as CMS.Offer;
        setDocumentId(work.documentId);
      } else {
        response = await Me.updateOffer(documentId, confirmOffer);
      }

      if (response.status === 200 || response.status === 201) {
        console.log("offer updated", response);
        onChange(response.data as CMS.Offer);
        return;
      } else {
        console.error("Failed to update offer", response);
        alert("Failed to update offer");
        return;
      }
    } catch (error) {
      console.error("Failed to save offer", error);
    }
  };

  const disableAndEdit = async () => {
    
    var disableOffer: CMS.UpdateOffer = {
      State: CMS.OfferState.Unavailable,
    }
    try {
      var response;
      
      response = await Me.updateOffer(documentId, disableOffer);

      if (response.status === 200 || response.status === 201) {
        console.log("offer updated", response);
        setEditLocked(false);
        return;
      } else {
        console.error("Failed to update offer", response);
        alert("Failed to update offer");
        return;
      }
    } catch (error) {
      console.error("Failed to save offer", error);
    }
  }

  return (
    <Sidebar open={open} onClose={onClose} title="Offer Details">
      {!inReview && (
        <div className={cn(
          "flex flex-col gap-6 p-4",
        )}>
          <div className="flex flex-col gap-4">
            <Text variant="body-md">Offer Details</Text>
            <Text variant="body-xs" color="secondary">
              Please fill out the details of your offer. This will be sent to the client for review.
            </Text>
            {editLocked && (
            <Text variant="body-xs" color="danger">
              This offer has already been sent to the client for review. It must be disabled before editing further.
              <SlideButton
                text="Disable To Edit"
                confirmText="Confirmed!"
                variant="danger"
                onConfirm={disableAndEdit}
                className="mt-4"
              />
            </Text>
            
            )}

          </div>
          <div className={cn(
            "flex flex-col gap-4 p-4 rounded-lg border border-stroke bg-background-50",
          )}>
            <Text variant="body-md">Content</Text>
            <Input
              label="Title"
              name="Title"
              value={formData.Title}
              onChange={onInputChange}
              placeholder="What are you creating?"
              required
              maxLength={40}
              disabled={editLocked}
            />
            <TextArea
              label="Details"
              name="Details"
              value={formData.Details}
              onChange={onTextAreaChange}
              placeholder="What're the agreed upon details of the content to be created?"
              required
              minLength={150}
              maxLength={500}
              showCharacterCount
              disabled={editLocked}
            />
            <Input
              label="Delivery"
              name="Delivery"
              value={formData.Delivery}
              onChange={onInputChange}
              placeholder="ex: 2 days, 1 week"
              required
              maxLength={40}
              disabled={editLocked}
            />
            <Input
              label="Amount"
              name="Amount"
              type="number"
              min={0}
              max={10000}
              value={formData.Amount}
              onChange={onInputChange}
              placeholder="Enter Price (USD)"
              required
              disabled={editLocked}
            />
            
            <Input
              label="Client"
              name="ForEmail"
              value={formData.ForEmail}
              onChange={onInputChange}
              placeholder="Who is this for?"
              disabled={editLocked}
            />

            <Input
              label="Expires"
              name="Expires"
              type="date"
              value={formData.Expires}
              onChange={onInputChange}
              placeholder="When does this offer expire?"
              required
              min={new Date().toISOString().split("T")[0]}
              max={new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]}
              disabled={editLocked}
            />

          </div>
          <div className="flex justify-between items-center mt-6">
            <Button
              variant="outlined"
              color="black"
              onClick={onSave}
              disabled={
                inReview ||
                !formData.Title ||
                !formData.Amount ||
                !!urlError
              }
              className="mt-4"
            >
              Save & Close
            </Button>
          
            <Button
              variant="filled"
              color="black"
              onClick={onReviewClicked}
              disabled={
                !canEnableOffer ||
                inReview ||
                !formData.Title ||
                !formData.Amount ||
                !!urlError
              }
              className="mt-4"
            >
              {canEnableOffer ? "Review" : "Review Unavailable"}
            </Button>
          </div>
        </div>
      
      ) || (
        <div className="flex flex-col gap-6 p-4">
          <Summary
            header="Summary"
            title={formData.Title}
            description={formData.Details}
            formData={{
              ClientEmail: formData.ForEmail,            
              Delivery: formData.Delivery,
              Expires: formData.Expires,
            }}
            footer={{
              Amount: formatPrice(formData.Amount || 0),
            }}
          />
          <div className="flex justify-between items-center mt-6">
            <Button
              variant="outlined"
              color="black"
              onClick={onReviseClicked}
              disabled={!inReview}
              className="mt-4"
            >
              Revise
            </Button>
            
            <Button
              variant="filled"
              color="black"
              onClick={onConfirm}
              disabled={!canEnableOffer || !inReview}
              className="mt-4"
            >
              Confirm & Enable
            </Button>
          </div>
          
          <SlideButton
              text="Slide to Enable"
              confirmText="Confirmed!"
              onConfirm={onConfirm}
              
              className="mt-4"
              disabled={!canEnableOffer || !inReview}
            />
        </div>
        
      )}
    </Sidebar>
  );
};
