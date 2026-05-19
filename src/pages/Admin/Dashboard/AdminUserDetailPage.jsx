import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import config from "../../../config";
import toast from "react-hot-toast";

const placeholderAvatar = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQoVxP6BSWt_Th-gPE1VK6416lx09HTdfHs0w&s";
const ownerRoles = new Set(["owner", "host", "seller", "buyer"]);

const getSafeText = (value) => {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value.trim();
  return String(value).trim();
};

const getDisplayValue = (value) => {
  const safeValue = getSafeText(value);
  return safeValue.length > 0 ? safeValue : "-";
};

const toDateLabel = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toISOString().slice(0, 10);
};

const isImageUrl = (url) => /\.(png|jpe?g|gif|webp|bmp|svg)(\?.*)?$/i.test(url || "");

const AdminUserDetailPage = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState(null);

  const fetchSingleUser = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${config.baseUrl}/account/single/${id}`);
      setUser(res.data.data);
    } catch {
      toast.error("Failed to fetch user details");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchSingleUser();
  }, [fetchSingleUser]);

  if (isLoading) return <p className="p-6">Loading user details...</p>;
  if (!user) return <p className="p-6">User not found.</p>;

  const role = getSafeText(user.role).toLowerCase();
  const isOwner = ownerRoles.has(role);
  const roleLabel = getDisplayValue(role ? `${role.charAt(0).toUpperCase()}${role.slice(1)}` : "");

  const fullName = getSafeText(user.name);
  const [firstName = "", ...lastNameParts] = fullName.split(/\s+/).filter(Boolean);
  const lastName = lastNameParts.join(" ");

  const personalInfo = [
    { label: "First Name", value: firstName },
    { label: "Last Name", value: lastName },
    { label: "Email Address", value: user.email, theme: "text-blue-600" },
    { label: "Phone Number", value: user.phone },
    { label: "Role", value: roleLabel },
    { label: "KYC Status", value: user.kycVerified ? "Verified" : "Pending" },
  ];

  const locationInfo = [
    { label: "Country", value: user.country },
    { label: "Province / State", value: user.state },
    { label: "Postal Code", value: user.postalCode },
    { label: "Address", value: user.address, full: true },
    { label: "Street", value: user.street, full: true },
  ];

  const documents = [
    { key: "licenseFrontImage", label: "License Front" },
    { key: "licenseBackImage", label: "License Back" },
    { key: "faq27Image", label: "Endorsement / FAQ 27", renterOnly: true },
    { key: "trailerRegistrationImage", label: "Trailer Registration", ownerOnly: true },
    { key: "trailerInsurancePolicyImage", label: "Trailer Insurance", ownerOnly: true },
  ].filter((doc) => {
    if (doc.ownerOnly && !isOwner) return false;
    if (doc.renterOnly && isOwner) return false;
    return true;
  });

  const aboutText =
    getSafeText(user.aboutOwner) ||
    getSafeText(user.bio) ||
    (isOwner ? "No owner bio provided." : "No renter bio provided.");

  const avatar = getSafeText(user.profilePicture) || placeholderAvatar;

  const openDocument = (doc) => {
    const docUrl = getSafeText(user[doc.key]);
    if (!docUrl) return;

    setSelectedDocument({
      title: doc.label,
      url: docUrl,
      type: isImageUrl(docUrl) ? "image" : "file",
    });
  };

  const closeDocument = () => setSelectedDocument(null);

  return (
    <div className='min-h-screen space-y-8 pb-10 px-2 sm:px-0'>
      {selectedDocument && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/70 backdrop-blur-sm p-4"
          onClick={closeDocument}
        >
          <div
            className="relative w-full max-w-5xl overflow-hidden rounded-[2rem] bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Document Preview</p>
                <h3 className="text-lg font-black text-gray-900">{selectedDocument.title}</h3>
              </div>
              <button
                type="button"
                onClick={closeDocument}
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-gray-100 text-gray-500 transition hover:bg-gray-50 hover:text-gray-900"
                aria-label="Close document preview"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="max-h-[80vh] overflow-auto bg-gray-50 p-4 sm:p-6">
              {selectedDocument.type === "image" ? (
                <img
                  src={selectedDocument.url}
                  alt={selectedDocument.title}
                  className="mx-auto h-auto max-h-[72vh] w-auto max-w-full rounded-2xl border border-gray-100 bg-white shadow-lg"
                />
              ) : (
                <iframe
                  src={selectedDocument.url}
                  title={selectedDocument.title}
                  className="h-[72vh] w-full rounded-2xl border border-gray-100 bg-white shadow-lg"
                />
              )}
            </div>
          </div>
        </div>
      )}

      <header>
        <h1 className='text-2xl sm:text-3xl font-black text-gray-900 tracking-tight'>User Details</h1>
        <p className="text-sm text-gray-500 font-medium tracking-tight">Viewing detailed profile information for {getDisplayValue(fullName)}.</p>
      </header>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Profile Sidebar */}
        <aside className="lg:w-1/3 xl:w-1/4 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col items-center text-center space-y-6">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
              <img
                src={avatar}
                alt="User Avatar"
                className="relative w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl"
              />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight leading-tight">{getDisplayValue(fullName)}</h2>
              <span className={`inline-block px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${user.accountBlocked ? "bg-red-50 text-red-600 border border-red-100" : "bg-green-50 text-green-600 border border-green-100"}`}>
                {user.accountBlocked ? "Account Blocked" : "Active Member"}
              </span>
            </div>

            <div className="w-full pt-6 border-t border-gray-50 flex flex-col items-center gap-4">
              <div className="flex items-center gap-3 text-sm font-bold text-gray-400 uppercase tracking-widest">
                <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                Joined {toDateLabel(user.createdAt)}
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-6">
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center justify-between">
              Account Status
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            </h4>
            <button className="w-full py-4 bg-gray-50 text-gray-900 font-black text-xs uppercase tracking-widest rounded-2xl border-2 border-transparent hover:border-blue-600 hover:bg-white transition-all">
              Update Account Settings
            </button>
          </div>
        </aside>

        {/* Info Grid */}
        <main className="flex-1 space-y-8">
          <div className="bg-white p-8 sm:p-12 rounded-[3rem] shadow-sm border border-gray-100 space-y-12">
            <section className="space-y-8">
              <h3 className="text-xl font-black text-gray-900 tracking-tight px-4 border-l-4 border-blue-600">Personal Information</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {personalInfo.map((item, idx) => (
                  <div key={idx} className="space-y-1 group">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest transition-colors group-hover:text-blue-600">{item.label}</p>
                    <p className={`text-base font-bold truncate ${item.theme || 'text-gray-900'}`}>{getDisplayValue(item.value)}</p>
                  </div>
                ))}
              </div>
            </section>

            <hr className="border-gray-50" />

            <section className="space-y-8">
              <h3 className="text-xl font-black text-gray-900 tracking-tight px-4 border-l-4 border-blue-600">Location & Address</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-gray-700">
                {locationInfo.map((item, idx) => (
                  <div key={idx} className={`space-y-1 group ${item.full ? 'sm:col-span-2' : ''}`}>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest transition-colors group-hover:text-blue-600">{item.label}</p>
                    <p className="text-base font-bold text-gray-900">{getDisplayValue(item.value)}</p>
                  </div>
                ))}
              </div>
            </section>

            <hr className="border-gray-50" />

            <section className="space-y-6">
              <h3 className="text-xl font-black text-gray-900 tracking-tight px-4 border-l-4 border-blue-600">Verification Documents</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {documents.map((doc) => {
                  const docUrl = getSafeText(user[doc.key]);
                  const hasDocument = docUrl.length > 0;

                  return (
                    <div key={doc.key} className="rounded-2xl border border-gray-100 bg-gray-50 p-4 space-y-3">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{doc.label}</p>
                      {hasDocument ? (
                        <button
                          type="button"
                          onClick={() => openDocument(doc)}
                          className="flex items-center gap-3 rounded-xl border border-blue-100 bg-white p-2 hover:border-blue-300 transition"
                        >
                          {isImageUrl(docUrl) ? (
                            <img src={docUrl} alt={doc.label} className="w-12 h-12 rounded-lg object-cover border border-gray-100" />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 font-black text-xs">
                              PDF
                            </div>
                          )}
                          <span className="text-sm font-bold text-blue-700">View Document</span>
                        </button>
                      ) : (
                        <p className="text-sm font-semibold text-gray-500">Not uploaded</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            <hr className="border-gray-50" />

            <section className="space-y-6">
              <h3 className="text-xl font-black text-gray-900 tracking-tight px-4 border-l-4 border-blue-600">About {isOwner ? "Owner" : "Renter"}</h3>
              <div className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
                <p className="text-base font-medium text-gray-600 leading-relaxed italic">&quot;{aboutText}&quot;</p>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminUserDetailPage;
