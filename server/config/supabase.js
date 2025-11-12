import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv';
dotenv.config();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)

const fileUploader = async (file) => {
    const { data, error } = await supabase.storage
        .from('blog')
        .upload(`${Date.now()}_${file.originalname}`, file.buffer, {
            contentType: file.mimetype,
        });

    if (error) {
        console.error("Supabase upload error:", error);
        throw error;
    }

    const { data: publicUrlData } = supabase.storage
        .from('blog')
        .getPublicUrl(data.path);

    return publicUrlData.publicUrl;
};
export { supabase, fileUploader };