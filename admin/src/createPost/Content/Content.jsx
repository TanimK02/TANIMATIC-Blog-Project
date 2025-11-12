import { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import styles from './content.module.css';


export default function Content({ initialContent = '', onContentChange }) {

    const editorRef = useRef(null);

    function handleContentChange(content) {
        onContentChange(content);
    }

    return (
        <div className={styles.contentContainer}>
            <p className={styles.contentLabel}>Content</p>
            <div className={styles.editorWrapper}>

                <Editor
                    apiKey='dfzykt2qsszk90emd1cc2v9ndcrkkq78ycwhbgqus21ytfb2'
                    init={{
                        plugins: [
                            // Core editing features
                            'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks', 'wordcount',
                            // Your account includes a free trial of TinyMCE premium features
                            // Try the most popular premium features until Nov 24, 2025:
                            'checklist', 'mediaembed', 'casechange', 'formatpainter', 'pageembed', 'a11ychecker', 'tinymcespellchecker', 'permanentpen', 'powerpaste', 'advtable', 'advcode', 'advtemplate', 'ai', 'uploadcare', 'mentions', 'tinycomments', 'tableofcontents', 'footnotes', 'mergetags', 'autocorrect', 'typography', 'inlinecss', 'markdown', 'importword', 'exportword', 'exportpdf'
                        ],
                        toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography uploadcare | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
                        tinycomments_mode: 'embedded',
                        tinycomments_author: 'Author name',
                        mergetags_list: [
                            { value: 'First.Name', title: 'First Name' },
                            { value: 'Email', title: 'Email' },
                        ],
                        ai_request: (request, respondWith) => respondWith.string(() => Promise.reject('See docs to implement AI Assistant')),
                        uploadcare_public_key: 'a56ad28a082245be5c3b',
                    }}
                    initialValue="Welcome to TinyMCE!"
                />

            </div>
        </div>
    );
}
