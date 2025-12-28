import { pb } from "@/lib/pocketbase";
const COLLECTION = "Profile";

export interface ProfileData {
  id: string;
  name: string;   
  phone: string;  
  avatar: string;
  avatarUrl: string;
}

export const getAvatarUrl = (recordId: string, fileName: string) => {
  if (!fileName) return "";
  return `${pb.baseUrl}/api/files/${COLLECTION}/${recordId}/${fileName}`;
};

export const loginUser = async (username: string, password: string) => {
  const record = await pb.collection(COLLECTION).getFirstListItem(`user="${username}" && Password="${password}"`);
  localStorage.setItem("meow_user_id", record.id);
  return record;
};

export const registerUser = async (data: { user: string; phone: string; Password: string }) => {
  const record = await pb.collection(COLLECTION).create({
    user: data.user,
    phone: Number(data.phone), 
    Password: data.Password,
  });
  
  localStorage.setItem("meow_user_id", record.id);
  return record;
};

export const getProfile = async (): Promise<ProfileData | null> => {
  const storedId = localStorage.getItem("meow_user_id");
  if (!storedId) return null;

  try {
    const record = await pb.collection(COLLECTION).getOne(storedId);

    return {
      id: record.id,
      name: record.user,   
      phone: record.phone.toString(),  
      avatar: record.avatar,
      avatarUrl: getAvatarUrl(record.id, record.avatar),
    };
  } catch (error) {
    console.error("Gagal ambil profile:", error);
    localStorage.removeItem("meow_user_id");
    return null;
  }
};

export const updateProfile = async (id: string, data: { name: string; phone: string; avatarFile?: File }) => {
  const formData = new FormData();
  formData.append("user", data.name);      
  formData.append("phone", Number(data.phone).toString()); 
  if (data.avatarFile) {
    formData.append("avatar", data.avatarFile);
  }
  return await pb.collection(COLLECTION).update(id, formData);
};

export const logoutUser = () => {
  localStorage.removeItem("meow_user_id");
  window.location.reload(); 
};