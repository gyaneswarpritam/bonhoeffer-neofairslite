import React from "react";
import { useState, useRef, useEffect } from "react";
import { Tab, Tabs, TabList, TabPanel, listStyleType } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import Image from "next/image";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ImageNameModel from "./ImageNameModel";
import StallVideoModel from "./StallVideoModel";
import PdfViewer from "@/components/pdfViewer";
import { useQuery } from "@tanstack/react-query";
import { request } from "@/lib/axios";
import { uploadFiles } from "@/lib/upload";
import { useRouter } from "next/navigation";
// import { constantCertification } from "@/config/certification";
import { BUCKET_URL } from "@/config/constant";
import StallImages from "./stallImages";
import SocialMedia from "./socialMedia";
import VisitingCard from "./visitingCard";
import VideoModal from "@/components/VideoModal";
import Products from "./products";
import CompanyProfile from "./companyProfile";
import GalleyImages from "./galleyImages";
import GalleryVideo from "./galleryVideo";
import StallVideo from "./stallVideo";
import ReviewSettings from "./reviewSettings";
import StallInfo from "./stallInfo";
import Stepper from "./stepper";
import MyLoader from "@/components/my-loader";

const SettingTabs = () => {
  const router = useRouter();
  if (router.isFallback) {
    return <div>Loading...</div>;
  }
  const plusImage = `${BUCKET_URL}/stalls/plus.svg`;
  const exhibitorId =
    typeof window !== "undefined" ? localStorage.getItem("id") : null;
  const [tab, setTab] = useState(1);
  const [confirm, setConfirm] = useState(false);
  const [uploadPromises, setUploadPromises] = useState([]);
  const [dataObject, setDataObject] = useState({
    exhibitor: exhibitorId,
    hallId: "",
    hallName: "",
    stallName: "",
    stallDescription: "",
    // certifications: [],
    visitng_card_details: {
      name: "",
      email: "",
      phone: "",
      website: "",
      address: "",
    },
    social_media: {
      youtube: "",
      whatsapp: "",
      zoom: "",
      linkedin: "",
      meeting: "",
      facebook: "",
      twitter: "",
      website: "",
      instagram: "",
    },
    stallImage: "",
    stallLogo: "",
    companyLogo: "",
    productsList: [],
    companyProfileList: [],
    galleryImageList: [],
    galleryVideoList: [],
    stallVideoList: [],
  });

  const [products, setProducts] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [companyProfiles, setCompanyProfiles] = useState([]);
  const [stallVideo, setStallVideo] = useState([]);
  const [galleryVideo, setGalleryVideo] = useState([]);
  const [youtubeDivTitle, setYoutubeDivTitle] = useState("");
  const [youtubeid, setYoutubeID] = useState("");
  const [openStallVideoModel, setOpenStallVideoModel] = useState(false);
  const [openVideoModelName, setOpenVideoModelName] = useState(false);
  // const [selectedCertifications, setSelectedCertifications] = useState([]);

  const [openVideoViewModel, setOpenVideoViewModel] = useState(false);
  const [openPdfModel, setOpenPdfModel] = useState(false);
  const [pdfFile, setPdfFile] = useState(null);

  const [openImageModel, setOpenImageModel] = useState(false);
  const [imageFile, SetImageFile] = useState(null);
  const [imageFileModelName, setImageFileModelName] = useState("");

  const [imageLimit, setImageLimit] = useState(6);

  const [selectedTabIndexOne, setSelectedTabIndexOne] = useState(0);
  const [selectedTabIndexTwo, setSelectedTabIndexTwo] = useState(0);

  const [galleryimageLimit, setGalleryImageLimit] = useState(6);
  const [companyProfileLimit, setCompanyProfileLimit] = useState(6);

  const [editProduct, setEditProduct] = useState(true);
  const [editProfile, setEditProfile] = useState(true);
  const [editGallery, setEditGallery] = useState(true);
  const [editGalleryVideo, setEditGalleryVideo] = useState(true);
  const [editStallVideo, setEditStallVideo] = useState(true);

  const [uploadProgress, setUploadProgress] = useState(0);
  const [isVideo, setIsVideo] = useState(false);

  const uploadInput = useRef(null);
  const [numberObject, setNumberObject] = useState([
    { value: true },
    { value: false },
    { value: false },
    { value: false },
    { value: false },
  ]);
  const [imageNameObject, setImageNameObject] = useState({
    inputName: "",
    imageNameModelOpen: false,
    index: null,
    which: "",
    format: "",
  });

  const fetchStall = async () => {
    return request({
      url: `exhibitor/stall-by-exhibitor/${exhibitorId}`,
      method: "get",
    });
  };

  const { data: stallData } = useQuery({
    queryKey: ["stallDetails"],
    queryFn: fetchStall,
  });

  useEffect(() => {
    if (stallData && stallData.stall) {
      setDataObject({
        exhibitor: exhibitorId,
        hallId: stallData.stall.hallId,
        hallName: stallData.stall.hallName,
        stallName: stallData.stall.stallName,
        stallDescription: stallData.stall.stallDescription,
        // certifications: stallData.stall.certifications,
        visitng_card_details: {
          name: stallData.stall.visitng_card_details.name,
          email: stallData.stall.visitng_card_details.email,
          phone: stallData.stall.visitng_card_details.phone,
          website: stallData.stall.visitng_card_details.website,
          address: stallData.stall.visitng_card_details.address,
        },
        social_media: {
          youtube: stallData.stall.social_media.youtube,
          whatsapp: stallData.stall.social_media.whatsapp,
          zoom: stallData.stall.social_media.zoom,
          linkedin: stallData.stall.social_media.linkedin,
          meeting: stallData.stall.social_media.meeting,
          facebook: stallData.stall.social_media.facebook,
          twitter: stallData.stall.social_media.twitter,
          website: stallData.stall.social_media.website,
          instagram: stallData.stall.social_media.instagram,
        },
        stallImage: stallData.stall.stallImage,
        stallLogo: stallData.stall.stallLogo,
        companyLogo: stallData.stall.companyLogo,
        productsList: stallData.productsList,
        companyProfileList: stallData.companyProfileList,
        galleryImageList: stallData.galleryImageList,
        galleryVideoList: stallData.galleryVideoList,
        stallVideoList: stallData.stallVideoList,
        stallVideoLink: stallData.stall.stallVideoLink,
      });
      // setSelectedCertifications(stallData.stall.certifications || []);
    }
  }, [stallData]);

  useEffect(() => {
    setProducts(undefindedFunction(imageLimit));
    setGalleryImages(undefindedFunction(galleryimageLimit));
    setCompanyProfiles(undefindedFunction(companyProfileLimit));
  }, []);

  const undefindedFunction = (e) => {
    const arr = [];
    for (let i = 0; i < e; i++) {
      let unObject = {
        File: undefined,
        locked: false,
      };
      arr.push(unObject);
    }
    return arr;
  };

  const handleProductLimit = (e) => {
    setImageLimit(e.target.value);
    const previousImages = products.filter(function (element) {
      return element.File !== undefined;
    });
    if (e.target.value <= previousImages.length) {
      toast("Select the number more than the uploaded Images");
      return;
    } else {
      const unarray = undefindedFunction(10);
      previousImages.push(...unarray);
      const slicedImages = previousImages.slice(0, e.target.value);
      setProducts(slicedImages);
    }
  };
  const handleGalleryImageLimit = (e) => {
    setGalleryImageLimit(e.target.value);
    const previousImages = galleryImages.filter(function (element) {
      return element.File !== undefined;
    });
    if (e.target.value <= previousImages.length) {
      toast("Select the number more than the uploaded Images");
      return;
    } else {
      const unarray = undefindedFunction(10);
      previousImages.push(...unarray);
      const slicedImages = previousImages.slice(0, e.target.value);
      setGalleryImages(slicedImages);
    }
  };
  const handleCompanyProfileLimit = (e) => {
    setCompanyProfileLimit(e.target.value);
    const previousImages = companyProfiles.filter(function (element) {
      return element.File !== undefined;
    });
    if (e.target.value <= previousImages.length) {
      toast("Select the number more than the uploaded Images");
      return;
    } else {
      const unarray = undefindedFunction(10);
      previousImages.push(...unarray);
      const slicedImages = previousImages.slice(0, e.target.value);
      setCompanyProfiles(slicedImages);
    }
  };

  const productChange = (e) => {
    const files = e.target.files;
    const array = undefindedFunction(10);
    const prev = products;
    const data = prev.filter(function (element) {
      return element.File !== undefined;
    });
    for (let i = 0; i < files.length; i++) {
      data.push({ File: files[i], locked: false });
    }
    data.push(...array);
    const sliced = data.slice(0, imageLimit);
    setProducts(sliced);
  };
  const imageGalleryChange = (e) => {
    const files = e.target.files;
    const array = undefindedFunction(10);
    const prev = galleryImages;
    const data = prev.filter(function (element) {
      return element.File !== undefined;
    });
    for (let i = 0; i < files.length; i++) {
      data.push({ File: files[i], locked: false });
    }
    data.push(...array);
    const sliced = data.slice(0, galleryimageLimit);

    setGalleryImages(sliced);
  };
  const companyProfileChange = (e) => {
    const files = e.target.files;
    const array = undefindedFunction(10);
    const prev = companyProfiles;
    const data = prev.filter(function (element) {
      return element.File !== undefined;
    });
    for (let i = 0; i < files.length; i++) {
      data.push({ File: files[i], locked: false });
    }
    data.push(...array);
    const sliced = data.slice(0, companyProfileLimit);

    setCompanyProfiles(sliced);
  };
  const productChangeSingle = (e) => {
    const files = e.target.files;
    const array = undefindedFunction(10);
    const prev = products;
    const data = prev.filter(function (element) {
      return element.File !== undefined;
    });

    for (let i = 0; i < files.length; i++) {
      data.push({ File: files[i], locked: false });
    }
    data.push(...array);
    const sliced = data.slice(0, imageLimit);
    setProducts(sliced);
  };
  const imageGalleryChangeSingle = (e) => {
    const files = e.target.files;
    const array = undefindedFunction(10);
    const prev = galleryImages;
    const data = prev.filter(function (element) {
      return element.File !== undefined;
    });
    for (let i = 0; i < files.length; i++) {
      data.push({ File: files[i], locked: false });
    }
    data.push(...array);
    const sliced = data.slice(0, galleryimageLimit);
    setGalleryImages(sliced);
  };

  const companyProfileChangeSingle = (e) => {
    const files = e.target.files;
    const array = undefindedFunction(10);
    const prev = companyProfiles;
    const data = prev.filter(function (element) {
      return element.File !== undefined;
    });
    for (let i = 0; i < files.length; i++) {
      data.push({ File: files[i], locked: false });
    }
    data.push(...array);
    const sliced = data.slice(0, imageLimit);
    setCompanyProfiles(sliced);
  };

  const deleteGalleryHandle = (e) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this item?"
    );
    if (confirmed == true) {
      let previousImg = galleryImages;
      previousImg[e] = { File: undefined };
      const array = Array.from({ length: 10 });
      previousImg.push(...array);
      const sliced = previousImg.slice(0, imageLimit);
      setGalleryImages(sliced);
    }
  };
  const deleteCompanyProfileHandle = (e) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this item?"
    );
    if (confirmed == true) {
      let previousImg = companyProfiles;
      previousImg[e] = { File: undefined };
      const array = Array.from({ length: 10 });
      previousImg.push(...array);
      const sliced = previousImg.slice(0, imageLimit);
      setCompanyProfiles(sliced);
    }
  };

  const shadowDivClick = (e, item) => {
    if (item === undefined) {
      // setShadowDiv(e);
      document.getElementById("fileInput2").click();
    }
  };
  const shadowGalleryDivClick = (e, item) => {
    if (item === undefined) {
      document.getElementById("fileInputGallery2").click();
    }
  };
  const shadowCompanyProfileDivClick = (e, item) => {
    if (item === undefined) {
      document.getElementById("fileInputCompanyProfile2").click();
    }
  };

  const confirmButton = (e) => {
    setConfirm(!confirm);
  };

  const updateState = (e, updatedObject) => {
    const newArray = [...numberObject];
    newArray[e + 1] = updatedObject;
    setNumberObject(newArray);
  };

  // Show loader while uploading files
  useEffect(() => {
    if (uploadPromises && uploadPromises.length > 0) {
      setUploadProgress(1); // Show loader

      Promise.all(uploadPromises)
        .then(() => {
          setUploadProgress(0); // Hide loader
        })
        .catch(() => {
          setUploadProgress(0); // Hide loader even if some uploads fail
        })
        .finally(() => {
          setUploadProgress(0);
        });
    } else {
      setUploadProgress(0);
    }
  }, [uploadPromises]);

  const onUploadProgress = (progressEvent) => {
    const { loaded, total } = progressEvent;
    const percentage = Math.floor((loaded * 100) / total);
    setUploadProgress(percentage);
  };

  const plus = (e) => {
    const updatedObject = { ...numberObject[e], value: true };
    updateState(e, updatedObject);

    if (tab < 4) {
      setTab(tab + 1);
      const elements = document.getElementsByClassName("numbers");
      for (var i = 1; i < elements.length; i++) {
        if (i <= tab) {
          elements[i].classList.add("active");
          elements[i].classList.add("ac");
        } else {
          elements[i].classList.remove("active");
        }
      }
    }

    if (e == 2) {
      if (products) {
        const uploadPromisesData = products
          .filter((product) => product.File)
          .map((product) =>
            uploadFiles(product.File, { onUploadProgress })
              .then((res) => {
                let newProduct = {
                  title: product.File.name,
                  url: res,
                  locked: product.locked,
                };
                setDataObject((prevState) => ({
                  ...prevState,
                  productsList: [...prevState.productsList, newProduct],
                }));
                return res; // Return result for Promise.all
              })
              .catch((error) => {
                console.error("Error uploading file:", error);
                throw error; // Rethrow to handle in Promise.all
              })
          );
        setUploadPromises(uploadPromisesData);
        // products.map((product) => {
        //   if (product.File) {
        //     uploadFiles(product.File, { onUploadProgress })
        //       .then((res) => {
        //         let newProduct = {
        //           title: product.File.name,
        //           url: res,
        //           locked: product.locked,
        //         };
        //         setDataObject((prevState) => ({
        //           ...prevState,
        //           productsList: [...prevState.productsList, newProduct],
        //         }));
        //         setUploadProgress(0);
        //       })
        //       .catch((error) => {
        //         console.error("Error uploading file:", error);
        //       });
        //   }
        // });
      }
      if (companyProfiles) {
        const uploadPromisesProfiles = companyProfiles
          .filter((profile) => profile.File)
          .map((profile) =>
            uploadFiles(profile.File, { onUploadProgress })
              .then((res) => {
                let newProfile = {
                  title: profile.File.name,
                  url: res,
                  locked: profile.locked,
                };
                setDataObject((prevState) => ({
                  ...prevState,
                  companyProfileList: [
                    ...prevState.companyProfileList,
                    newProfile,
                  ],
                }));
                return res; // Return result for Promise.all
              })
              .catch((error) => {
                console.error("Error uploading file:", error);
                throw error; // Rethrow to handle in Promise.all
              })
          );
        setUploadPromises((prev) => [...prev, ...uploadPromisesProfiles]);
      }
      if (galleryImages) {
        const uploadPromisesImages = galleryImages
          .filter((image) => image.File)
          .map((image) =>
            uploadFiles(image.File, { onUploadProgress })
              .then((res) => {
                let newImage = {
                  title: image.File.name,
                  url: res,
                  locked: image.locked,
                };
                setDataObject((prevState) => ({
                  ...prevState,
                  galleryImageList: [...prevState.galleryImageList, newImage],
                }));
                return res; // Return result for Promise.all
              })
              .catch((error) => {
                console.error("Error uploading file:", error);
                throw error; // Rethrow to handle in Promise.all
              })
          );
        setUploadPromises((prev) => [...prev, ...uploadPromisesImages]);
      }

      if (galleryVideo) {
        galleryVideo.map((gallery) => {
          setDataObject((prevState) => ({
            ...prevState,
            galleryVideoList: [...prevState.galleryVideoList, gallery],
          }));
        });
      }

      if (stallVideo) {
        stallVideo.map((stallVideo) => {
          setDataObject((prevState) => ({
            ...prevState,
            stallVideoList: [...prevState.stallVideoList, stallVideo],
          }));
        });
      }
    } else if (e == 3) {
      if (stallData && stallData.stall) {
        request({
          url: `exhibitor/stall/${stallData.stall._id}`,
          method: "put",
          data: dataObject,
        })
          .then((res) => {
            toast.success("Stall updated sucessfully", {
              position: toast.POSITION.TOP_RIGHT,
            });
            router.push("/exhibitor");
          })
          .catch((err) => console.log(err));
      } else {
        request({ url: "exhibitor/stall", method: "post", data: dataObject })
          .then((res) => {
            toast.success("Stall created sucessfully", {
              position: toast.POSITION.TOP_RIGHT,
            });
            router.push("/exhibitor");
          })
          .catch((err) => console.log(err));
      }
    }
  };
  const minus = () => {
    if (tab > 1) {
      setTab(tab - 1);
      const elements = document.getElementsByClassName("numbers");
    }
  };

  const handleNameChangeOpen = (e, value) => {
    if (value == "product") {
      const newArr = [...products];
      const name = newArr[e].File.name;
      let splited = name.split(".");
      setImageNameObject({
        ...imageNameObject,
        name: splited[0],
        index: e,
        imageNameModelOpen: true,
        which: "product",
        format: splited[1],
      });
    } else if (value == "gallery") {
      const newArr = [...galleryImages];
      const name = newArr[e].File.name;
      let splited = name.split(".");
      setImageNameObject({
        ...imageNameObject,
        name: splited[0],
        index: e,
        imageNameModelOpen: true,
        which: "gallery",
        format: splited[1],
      });
    } else if (value == "company profile") {
      const newArr = [...companyProfiles];
      const name = newArr[e].File.name;
      let splited = name.split(".");
      setImageNameObject({
        ...imageNameObject,
        name: splited[0],
        index: e,
        imageNameModelOpen: true,
        which: "company profile",
        format: splited[1],
      });
    }
  };
  const handleNameChange = (e) => {
    setImageNameObject({
      ...imageNameObject,
      imageNameModelOpen: false,
    });
  };
  const handleNameDiscard = (e) => {
    setImageNameObject({
      ...imageNameObject,
      imageNameModelOpen: false,
    });
  };
  const handleOpenStallVideoModel = (e) => {
    setOpenStallVideoModel(true);
    setOpenVideoModelName(e);
  };
  const handleStallVideoChange = (e, url) => {
    if (openVideoModelName == "stall") {
      let newArr = [...stallVideo];
      newArr.push({ title: e, url: url });
      setStallVideo(newArr);
    } else if (openVideoModelName == "gallery") {
      let newArr = [...galleryVideo];
      newArr.push({ title: e, url: url });
      setGalleryVideo(newArr);
    }
    setOpenStallVideoModel(false);
  };
  const handleStallVideoDiscard = (e) => {
    setOpenStallVideoModel(false);
  };
  const deleteStallVideo = (e, name) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this item?"
    );
    if (confirmed == true) {
      if (name == "gallery") {
        let newArr = [...galleryVideo];
        newArr.splice(e, 1);
        setGalleryVideo(newArr);
      } else if (name == "stall") {
        let newArr = [...stallVideo];
        newArr.splice(e, 1);
        setStallVideo(newArr);
      }
    }
  };
  function getYoutubeVideoId(url) {
    const pattern =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    let match = url.match(pattern);
    return match ? match[1] : null;
  }
  const openViewModel = (e, name) => {
    if (name == "gallery") {
      setYoutubeID(galleryVideo[e].url);
      setYoutubeDivTitle(galleryVideo[e].title);
    } else if (name == "stall") {
      setYoutubeID(stallVideo[e].url);
      setYoutubeDivTitle(stallVideo[e].title);
    }
    setOpenVideoViewModel(true);
  };
  const openVideoModel = (url, title) => {
    setYoutubeID(url);
    setYoutubeDivTitle(title);
    setOpenVideoViewModel(true);
  };
  const closeViewModel = (e) => {
    setOpenVideoViewModel(false);
  };

  const numberClick = (e) => {
    const newArray = [...numberObject];
    if (newArray[e].value != false) {
      setTab(e + 1);
    }
  };
  const name = imageNameObject.inputName;

  const handleTabSelectOne = (index) => {
    setSelectedTabIndexOne(index);
  };
  const handleTabSelectTwo = (index) => {
    setSelectedTabIndexTwo(index);
  };

  const openProduct = (e) => {
    const newArray = [...products];
    if (
      newArray[e].File != undefined &&
      newArray[e].File.type == "application/pdf"
    ) {
      const url = URL.createObjectURL(newArray[e].File);
      setPdfFile(url);
      setOpenPdfModel(true);
    } else if (newArray[e].File != undefined) {
      const url = URL.createObjectURL(newArray[e].File);
      SetImageFile(url);
      setImageFileModelName(newArray[e].File.name);
      setOpenImageModel(true);
    }
  };

  const showProduct = (url, type) => {
    if (type == "pdf") {
      setPdfFile(url);
      setOpenPdfModel(true);
    } else if (type == "image") {
      SetImageFile(url);
      setOpenImageModel(true);
    }
  };
  const openImage = (url, imageName) => {
    const isVideo = /\.(mp4|webm|ogg)$/i.test(url); // Check if the file is a video
    SetImageFile(url);
    setImageFileModelName(imageName);
    setIsVideo(isVideo); // New state to track if the file is a video
    setOpenImageModel(true);
  };
  const openCompany = (e) => {
    const newArray = [...companyProfiles];
    if (
      newArray[e].File != undefined &&
      newArray[e].File.type == "application/pdf"
    ) {
      const url = URL.createObjectURL(newArray[e].File);
      setPdfFile(url);
      setOpenPdfModel(true);
    } else if (newArray[e].File != undefined) {
      const url = URL.createObjectURL(newArray[e].File);
      SetImageFile(url);
      setImageFileModelName(newArray[e].File.name);
      setOpenImageModel(true);
    }
  };
  const openGallery = (e) => {
    const newArray = [...galleryImages];
    if (newArray[e].File != undefined) {
      const url = URL.createObjectURL(newArray[e].File);
      SetImageFile(url);
      setImageFileModelName(newArray[e].File.name);
      setOpenImageModel(true);
    }
  };
  const closePDFFile = () => {
    setOpenPdfModel(false);
  };
  const closeImageFile = () => {
    setOpenImageModel(false);
  };

  /*
   * Upload file
   */
  const handleFileChange = async (filedata, field) => {
    uploadFiles(filedata, { onUploadProgress }).then((res) => {
      setDataObject({
        ...dataObject,
        [field]: res,
      });
    });
  };

  const updateVideoLink = (link) => {
    setDataObject({
      ...dataObject,
      stallVideoLink: link,
    });
  };

  // Function to handle checkbox change
  // const handleCheckboxChange = (e) => {
  //   const { value, checked } = e.target;

  //   // Update selectedCertifications based on checkbox status
  //   if (checked) {
  //     setSelectedCertifications((prevSelected) => [...prevSelected, value]);
  //   } else {
  //     setSelectedCertifications((prevSelected) =>
  //       prevSelected.filter((cert) => cert !== value)
  //     );
  //   }

  //   // Pass the updated selectedCertifications to setDataObject
  //   setDataObject({
  //     ...dataObject,
  //     certifications: checked
  //       ? [...selectedCertifications, value] // Add value to selectedCertifications if checked
  //       : selectedCertifications.filter((cert) => cert !== value), // Remove value from selectedCertifications if unchecked
  //   });
  // };
  const handleModelClose = (e) => {
    document.getElementsByTagName("body")[0].style.overflow = "unset";
    setOpenVideoViewModel(false);
  };
  const [errors, setErrors] = useState({});

  const validateVisitingCard = () => {
    const newErrors = {};
    const { name, email, phone, address } = dataObject.visitng_card_details;

    if (!name) newErrors.name = "Name is required";
    if (!email) newErrors.email = "Email is required";
    if (!phone) newErrors.phone = "Phone number is required";
    if (!address) newErrors.address = "Address is required";

    setErrors(newErrors);

    // Return true if there are no errors
    return Object.keys(newErrors).length === 0;
  };
  const ValidateStallImages = () => {
    const newErrors = {};
    const { stallImage, stallLogo, companyLogo } = dataObject;

    if (!stallImage)
      newErrors.stallImage = "Stall Image / Stall Video is required";
    if (!stallLogo) newErrors.stallLogo = "Stall Logo is required";
    if (!companyLogo) newErrors.companyLogo = "Company Logo is required";

    setErrors(newErrors);

    // Return true if there are no errors
    return Object.keys(newErrors).length === 0;
  };
  return (
    <>
      <ToastContainer autoClose={1000} />
      {imageNameObject.imageNameModelOpen ? (
        <ImageNameModel
          handleDiscard={handleNameDiscard}
          handleNameChange={handleNameChange}
          Name={imageNameObject.name}
        ></ImageNameModel>
      ) : openStallVideoModel ? (
        <StallVideoModel
          handleStallDiscard={handleStallVideoDiscard}
          handleStallChange={handleStallVideoChange}
        ></StallVideoModel>
      ) : openVideoViewModel ? (
        <div className="w-full h-[100%] bg-white fixed left-0 right-0 top-0 bottom-0 z-[400] mx-auto my-auto flex flex-col justify-center items-start">
          <VideoModal
            title={"Stall Video"}
            videoUrl={youtubeid}
            handleModelClose={handleModelClose}
          />
        </div>
      ) : openPdfModel ? (
        <div className="w-full h-full bg-white fixed left-0 top-0 z-[500] flex flex-col justify-start mx-auto my-auto px-10 py-10 overflow-scroll gap-5">
          <PdfViewer className=" h-[70%]" file={pdfFile}></PdfViewer>
          <button
            onClick={closePDFFile}
            className="fixed z-20 top-10 right-10 cursor-pointer"
          >
            Close
          </button>
        </div>
      ) : openImageModel ? (
        <div className="w-full h-[100%] bg-white fixed left-0 right-0 top-0 bottom-0 z-[400] mx-auto my-auto flex flex-col justify-center items-start">
          <div className="w-full h-20 flex justify-between items-center bg-[#222222] px-8">
            <p className="font-lato text-xl font-semibold text-white">
              {imageFileModelName}
            </p>
            <div
              onClick={() => closeImageFile()}
              className="w-6 h-6 p-2 rounded-full bg-brand-color cursor-pointer"
            >
              <Image
                alt="close"
                height={100}
                width={100}
                src={`${BUCKET_URL}/Close.png`}
                unoptimized
                className="w-full h-auto"
              ></Image>
            </div>
          </div>
          <div className="ag-theme-alpine h-[90%] pb-20 px-10 w-full max-w-5xl m-auto">
            {isVideo ? (
              <video
                src={imageFile}
                controls
                className="h-full w-auto m-auto"
              ></video>
            ) : (
              <Image
                alt=""
                src={imageFile}
                height={400}
                width={400}
                className="h-full w-auto m-auto"
                unoptimized
              ></Image>
            )}
          </div>
        </div>
      ) : (
        ""
      )}
      <div className="md:w-[70%] w-full flex flex-col gap-5 boxes-main bg-white">
        <p className="font-quickSand text-xl font-bold text-black md:px-4">
          Stall Settings
        </p>
        <Stepper numberClick={numberClick} />
        {tab && tab === 1 ? (
          <StallInfo
            dataObject={dataObject}
            setDataObject={setDataObject}
            // constantCertification={constantCertification}
            // handleCheckboxChange={handleCheckboxChange}
            // selectedCertifications={selectedCertifications}
            plus={plus}
            minus={minus}
            tab={tab}
          />
        ) : tab && tab === 2 ? (
          <div className="tabs w-full h-full flex flex-col justify-between">
            <Tabs
              selectedIndex={selectedTabIndexOne}
              onSelect={handleTabSelectOne}
              className="flex flex-col md:flex-row"
            >
              <TabList className=" w-full md:w-[30%] flex flex-col md:border-r border-[#BCB4B4] py-4 font-quickSand text-sm text-[#A7A7A7]">
                <Tab>1. Visiting Card Details</Tab>
                <Tab>2. Stall Details</Tab>
                <Tab>3. Social Media</Tab>
              </TabList>
              <div className=" w-full md:w-[70%] md:p-7">
                <TabPanel>
                  <VisitingCard
                    setDataObject={setDataObject}
                    dataObject={dataObject}
                    errors={errors}
                  />
                </TabPanel>
                <TabPanel>
                  <StallImages
                    dataObject={dataObject}
                    openImage={openImage}
                    handleFileChange={handleFileChange}
                    errors={errors}
                    updateVideoLink={updateVideoLink}
                  />
                </TabPanel>
                <TabPanel>
                  <SocialMedia
                    setDataObject={setDataObject}
                    dataObject={dataObject}
                  />
                </TabPanel>
              </div>
            </Tabs>
            <div className=" border-t-[1px] text-base font-quickSand font-bold flex justify-start gap-5 pt-5 pb-10">
              <button
                onClick={minus}
                className="bg-[#DDDDDC] text-[#5E6672] h-10 px-5 rounded-lg"
              >
                Back
              </button>
              <button
                // onClick={(e) => plus(1)}
                onClick={(e) => {
                  if (validateVisitingCard() && ValidateStallImages()) {
                    plus(1);
                  }
                }}
                className=" bg-brand-color h-10 px-5 rounded-lg"
              >
                Next
              </button>
            </div>
          </div>
        ) : tab && tab === 3 ? (
          <div className="tabs w-full h-full flex flex-col justify-between">
            <Tabs
              selectedIndex={selectedTabIndexTwo}
              onSelect={handleTabSelectTwo}
              className="flex flex-col md:flex-row"
            >
              <TabList className=" w-full md:w-[30%] flex flex-col md:border-r border-[#BCB4B4] py-4 font-quickSand text-sm text-[#A7A7A7]">
                <Tab>1. Products</Tab>
                <Tab>2. Company Profile</Tab>
                <Tab>3. Gallery Images</Tab>
                <Tab>4. Gallery Videos</Tab>
                <Tab>5. Stall Videos</Tab>
              </TabList>
              <div className=" w-full md:w-[70%] p-7">
                <TabPanel>
                  <Products
                    productsList={dataObject.productsList}
                    products={products}
                    imageLimit={imageLimit}
                    handleProductLimit={handleProductLimit}
                    uploadInput={uploadInput}
                    productChange={productChange}
                    productChangeSingle={productChangeSingle}
                    openProduct={openProduct}
                    shadowDivClick={shadowDivClick}
                    handleNameChangeOpen={handleNameChangeOpen}
                    plusImage={plusImage}
                    openImage={openImage}
                    showProduct={showProduct}
                    editProduct={editProduct}
                    setEditProduct={setEditProduct}
                  />
                </TabPanel>
                <TabPanel>
                  <CompanyProfile
                    companyProfiles={companyProfiles}
                    companyProfileLimit={companyProfileLimit}
                    handleCompanyProfileLimit={handleCompanyProfileLimit}
                    plusImage={plusImage}
                    companyProfileChange={companyProfileChange}
                    companyProfileChangeSingle={companyProfileChangeSingle}
                    uploadInput={uploadInput}
                    openCompany={openCompany}
                    shadowCompanyProfileDivClick={shadowCompanyProfileDivClick}
                    deleteCompanyProfileHandle={deleteCompanyProfileHandle}
                    handleNameChangeOpen={handleNameChangeOpen}
                    editProfile={editProfile}
                    setEditProfile={setEditProfile}
                    companyProfileList={dataObject.companyProfileList}
                    showProduct={showProduct}
                  />
                </TabPanel>
                <TabPanel>
                  <GalleyImages
                    galleryImages={galleryImages}
                    galleryimageLimit={galleryimageLimit}
                    handleGalleryImageLimit={handleGalleryImageLimit}
                    plusImage={plusImage}
                    uploadInput={uploadInput}
                    openGallery={openGallery}
                    shadowGalleryDivClick={shadowGalleryDivClick}
                    deleteGalleryHandle={deleteGalleryHandle}
                    handleNameChangeOpen={handleNameChangeOpen}
                    imageGalleryChange={imageGalleryChange}
                    imageGalleryChangeSingle={imageGalleryChangeSingle}
                    galleryImageList={dataObject.galleryImageList}
                    editGallery={editGallery}
                    setEditGallery={setEditGallery}
                    openImage={openImage}
                  />
                </TabPanel>
                <TabPanel>
                  <GalleryVideo
                    galleryVideo={galleryVideo}
                    handleOpenStallVideoModel={handleOpenStallVideoModel}
                    openViewModel={openViewModel}
                    deleteStallVideo={deleteStallVideo}
                    galleryVideoList={dataObject.galleryVideoList}
                    editGalleryVideo={editGalleryVideo}
                    setEditGalleryVideo={setEditGalleryVideo}
                    openVideoModel={openVideoModel}
                  />
                </TabPanel>
                <TabPanel>
                  <StallVideo
                    stallVideo={stallVideo}
                    handleOpenStallVideoModel={handleOpenStallVideoModel}
                    openViewModel={openViewModel}
                    deleteStallVideo={deleteStallVideo}
                    stallVideoList={dataObject.stallVideoList}
                    editStallVideo={editStallVideo}
                    setEditStallVideo={setEditStallVideo}
                    openVideoModel={openVideoModel}
                  />
                </TabPanel>
              </div>
            </Tabs>
            <div className=" border-t-[1px] text-base font-quickSand font-bold flex justify-start gap-5 pt-5 pb-10">
              <button
                onClick={minus}
                className="bg-[#DDDDDC] text-[#5E6672] h-10 px-5 rounded-lg"
              >
                Back
              </button>
              <button
                onClick={(e) => plus(2)}
                className=" bg-brand-color h-10 px-5 rounded-lg"
              >
                Next
              </button>
            </div>
          </div>
        ) : tab && tab === 4 ? (
          uploadProgress ? (
            <MyLoader />
          ) : (
            <ReviewSettings
              dataObject={dataObject}
              plus={plus}
              minus={minus}
              stallData={stallData}
            />
          )
        ) : (
          <div className="tabs w-full h-full flex flex-col justify-between">
            <div>
              <div className=" flex flex-row gap-2.5 justify-start items-center mt-4 max-w-[300px]">
                <Image
                  alt="img"
                  src={`${BUCKET_URL}/stalls/stalls.svg`}
                  height={3000}
                  width={3000}
                  className="w-8 h-8"
                ></Image>
                <p className=" text-xs font-quickSand font-semibold text-accent-font-color">
                  Create a Stall in a hall of your choice. Create it for an
                  exhibitor or for yourself.
                </p>
              </div>
              <button className=" mt-10 bg-brand-color text-sm font-quickSand font-bold px-4 py-2 uppercase">
                Confirm Creation
              </button>
            </div>
            <div className=" border-t-[1px] text-base font-quickSand font-bold flex justify-start gap-5 pt-5 pb-10">
              <button
                onClick={minus}
                className="bg-[#DDDDDC] text-[#5E6672] h-10 px-5 rounded-lg"
              >
                Back
              </button>
              <button className=" bg-brand-color h-10 px-5 rounded-lg">
                Go Home
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SettingTabs;
