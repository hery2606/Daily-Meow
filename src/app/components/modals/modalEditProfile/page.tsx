"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom"; 
import { X, User, Phone, Camera, Save, PawPrint, Sparkles } from "lucide-react"; 
import { motion } from "framer-motion";
import { useSweetAlert } from "@/ui/SweetAlertProvider";

// Import fungsi update
import { updateProfile, ProfileData } from "@/services/profileService";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData: ProfileData; 
  onSuccess: () => void;
}

export default function EditProfileModal({
  isOpen,
  onClose,
  userData,
  onSuccess,
}: EditProfileModalProps) {
  const swal = useSweetAlert();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setName(userData.name || "");
      setPhone(userData.phone || "");
      setPreviewImage(userData.avatarUrl || "");
      setSelectedFile(null);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen, userData]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!userData.id) {
        swal.showErrorToast("Error: ID tidak ditemukan. Login dulu.");
        return;
    }
    
    setIsLoading(true);
    try {
        await updateProfile(userData.id, {
            name: name, // Ini akan mengupdate field 'user'
            phone: phone, // Ini akan mengupdate field 'phone'
            avatarFile: selectedFile || undefined
        });

        swal.showSuccessToast("Profile Updated! ✨");
        onSuccess(); 
        onClose();
    } catch (error) {
        console.error(error);
        swal.showErrorToast("Gagal update profile.");
    } finally {
        setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white rounded-[25px] p-6 shadow-2xl relative flex flex-col max-h-[90vh] overflow-y-auto"
      >
        {/* Dekorasi & Header sama seperti sebelumnya */}
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-800">Edit Profile</h2>
            <button onClick={onClose}><X size={20}/></button>
        </div>

        <div className="space-y-4">
             {/* Foto */}
            <div className="flex flex-col items-center">
                <div className="relative group cursor-pointer">
                    <div className="h-24 w-24 rounded-full overflow-hidden border-4 border-pink-50 bg-slate-100">
                        {previewImage ? <img src={previewImage} className="h-full w-full object-cover"/> : <User size={40}/>}
                    </div>
                    <label htmlFor="edit-photo" className="absolute bottom-0 right-0 bg-pink-500 text-white p-2 rounded-full cursor-pointer"><Camera size={16}/></label>
                    <input type="file" id="edit-photo" className="hidden" accept="image/*" onChange={handleImageChange} />
                </div>
            </div>

            {/* Input User */}
            <div>
                <label className="text-xs font-bold text-slate-500">Username (Field: user)</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-3 bg-slate-50 rounded-xl" />
            </div>

            {/* Input Phone */}
            <div>
                <label className="text-xs font-bold text-slate-500">Phone (Field: phone)</label>
                <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full p-3 bg-slate-50 rounded-xl" />
            </div>
            
            <button onClick={handleSave} disabled={isLoading} className="w-full bg-pink-400 text-white py-3 rounded-xl font-bold mt-4">
                {isLoading ? "Saving..." : "Simpan Perubahan"}
            </button>
        </div>
      </motion.div>
    </div>,
    document.body
  );
}