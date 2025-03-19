import { BUCKET_URL } from "@/config/constant";
import Image from "next/image";
import React from "react";

const SocialMedia = ({ setDataObject, dataObject }) => {
  return (
    <div className="w-full flex flex-col gap-4 ">
      <div className=" relative flex items-center">
        <Image
          alt="img"
          src={`${BUCKET_URL}/stalls/input-youtube.svg`}
          height={3000}
          width={3000}
          className="w-auto h-6 absolute ml-2"
        ></Image>
        <input
          id="Youtube"
          className=" w-full text-sm font-quickSand font-semibold h-10 rounded-lg bg-[#F2F2F2] px-3 social-media-input"
          type="text"
          placeholder="Youtube"
          value={dataObject.social_media.youtube}
          onChange={(e) =>
            setDataObject({
              ...dataObject,
              social_media: {
                ...dataObject.social_media,
                youtube: e.target.value,
              },
            })
          }
        />
      </div>
      <div className=" relative flex items-center">
        <Image
          alt="img"
          src={`${BUCKET_URL}/stalls/input-whatsapp.svg`}
          height={3000}
          width={3000}
          className="w-auto h-6 absolute ml-2"
        ></Image>
        <input
          id="Whatsapp"
          className=" w-full text-sm font-quickSand font-semibold h-10 rounded-lg bg-[#F2F2F2] px-3 social-media-input"
          type="text"
          placeholder="Whatsapp"
          value={dataObject.social_media.whatsapp}
          onChange={(e) =>
            setDataObject({
              ...dataObject,
              social_media: {
                ...dataObject.social_media,
                whatsapp: e.target.value,
              },
            })
          }
        />
      </div>
      <div className=" relative flex items-center">
        <Image
          alt="img"
          src={`${BUCKET_URL}/stalls/input-zoom.svg`}
          height={3000}
          width={3000}
          className="w-auto h-6 absolute ml-2"
        ></Image>
        <input
          id="Zoom"
          className=" w-full text-sm font-quickSand font-semibold h-10 rounded-lg bg-[#F2F2F2] px-3 social-media-input"
          type="text"
          placeholder="Zoom"
          value={dataObject.social_media.zoom}
          onChange={(e) =>
            setDataObject({
              ...dataObject,
              social_media: {
                ...dataObject.social_media,
                zoom: e.target.value,
              },
            })
          }
        />
      </div>
      <div className=" relative flex items-center">
        <Image
          alt="img"
          src={`${BUCKET_URL}/stalls/input-linkedin.svg`}
          height={3000}
          width={3000}
          className="w-auto h-6 absolute ml-2"
        ></Image>
        <input
          id="LinkedIn"
          className=" w-full text-sm font-quickSand font-semibold h-10 rounded-lg bg-[#F2F2F2] px-3 social-media-input"
          type="text"
          placeholder="LinkedIn"
          value={dataObject.social_media.linkedin}
          onChange={(e) =>
            setDataObject({
              ...dataObject,
              social_media: {
                ...dataObject.social_media,
                linkedin: e.target.value,
              },
            })
          }
        />
      </div>
      <div className=" relative flex items-center">
        <Image
          alt="img"
          src={`${BUCKET_URL}/stalls/input-meeting.svg`}
          height={3000}
          width={3000}
          className="w-auto h-6 absolute ml-2"
        ></Image>
        <input
          id="MeetingLink"
          className=" w-full text-sm font-quickSand font-semibold h-10 rounded-lg bg-[#F2F2F2] px-3 social-media-input"
          type="text"
          placeholder="MeetingLink"
          value={dataObject.social_media.meeting}
          onChange={(e) =>
            setDataObject({
              ...dataObject,
              social_media: {
                ...dataObject.social_media,
                meeting: e.target.value,
              },
            })
          }
        />
      </div>
      <div className=" relative flex items-center">
        <Image
          alt="img"
          src={`${BUCKET_URL}/stalls/input-facebook.svg`}
          height={3000}
          width={3000}
          className="w-auto h-6 absolute ml-2"
        ></Image>
        <input
          id="facebook"
          className=" w-full text-sm font-quickSand font-semibold h-10 rounded-lg bg-[#F2F2F2] px-3 social-media-input"
          type="text"
          placeholder="facebook"
          value={dataObject.social_media.facebook}
          onChange={(e) =>
            setDataObject({
              ...dataObject,
              social_media: {
                ...dataObject.social_media,
                facebook: e.target.value,
              },
            })
          }
        />
      </div>
      <div className=" relative flex items-center">
        <Image
          alt="img"
          src={`${BUCKET_URL}/stalls/input-twitter.svg`}
          height={3000}
          width={3000}
          className="w-auto h-6 absolute ml-2"
        ></Image>
        <input
          id="Twitter"
          className=" w-full text-sm font-quickSand font-semibold h-10 rounded-lg bg-[#F2F2F2] px-3 social-media-input"
          type="text"
          placeholder="Twitter"
          value={dataObject.social_media.twitter}
          onChange={(e) =>
            setDataObject({
              ...dataObject,
              social_media: {
                ...dataObject.social_media,
                twitter: e.target.value,
              },
            })
          }
        />
      </div>
      <div className=" relative flex items-center">
        <Image
          alt="img"
          src={`${BUCKET_URL}/stalls/website.svg`}
          height={3000}
          width={3000}
          className="w-auto h-6 absolute ml-2"
        ></Image>
        <input
          id="Website"
          className=" w-full text-sm font-quickSand font-semibold h-10 rounded-lg bg-[#F2F2F2] px-3 social-media-input"
          type="text"
          placeholder="Website"
          value={dataObject.social_media.website}
          onChange={(e) =>
            setDataObject({
              ...dataObject,
              social_media: {
                ...dataObject.social_media,
                website: e.target.value,
              },
            })
          }
        />
      </div>
    </div>
  );
};

export default SocialMedia;
