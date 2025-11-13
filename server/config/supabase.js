import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv';
dotenv.config();

// Validate environment variables
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables');
}

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)

const fileUploader = async (file) => {
    const { data, error } = await supabase.storage
        .from('blog')
        .upload(`${Date.now()}_${file.originalname}`, file.buffer, {
            contentType: file.mimetype,
            upsert: false
        });

    if (error) {
        console.error("Supabase upload error:", error);
        throw new Error(`File upload failed: ${error.message}`);
    }

    const { data: publicUrlData } = supabase.storage
        .from('blog')
        .getPublicUrl(data.path);

    return publicUrlData.publicUrl;
};
export { supabase, fileUploader };