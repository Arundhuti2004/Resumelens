import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import FileUploader from '~/components/FileUploader';
import Navbar from '~/components/Navbar';
import { prepareInstructions } from '~/constants';
import { convertPdfToImage } from '~/lib/pdf2img';
import { usePuterStore } from '~/lib/putur';
import { generateUUID } from '~/lib/utils';


const Upload = () => {

  const {auth , isLoading , fs , ai , kv} = usePuterStore();
  const navigate = useNavigate();
    const [isProcessing , setIsProcessing] = useState(false);
    const [statusText , setStatusText] = useState('');
    const [file , setFile] = useState(null);


    const handleFileSelect = (file) => {
      setFile(file);
    }

    const handleRemove = () => {
    setFile(null); 
  };

    const handleAnalyze = async({companyName , jobTitle , jobDescription , file}) =>{
      try{
        setIsProcessing(true);
        setStatusText('Uploading the file');
        const uploadFile = await fs.upload([file]);
        console.log(uploadFile);
        
        if(!uploadFile ||!uploadFile.path){
           setStatusText('Error : Failed to upload file..');
           return
        }


        setStatusText('Converting to Image...');

        const imageResult = await convertPdfToImage(file);

        if(!imageResult?.file){ setStatusText('Error : Failed to convert PDF to image');
          return
        }

        setStatusText('Uploading the image ...');

        const { file: imageFile } = imageResult;

        const uploadedImage = await fs.upload(imageFile);

        if(!uploadedImage || !uploadedImage.path){
           setStatusText('Error : Failed to upload image');
           return
          }

        setStatusText('Preparing data...');

        const uuid = generateUUID();

        const data = {
          id : uuid,
          resumePath : uploadFile.path,
          imagePath : uploadedImage.path,
          companyName , jobTitle , jobDescription,
          feedback : '',
        }


        await kv.set(`resume:${uuid}` , JSON.stringify(data));

        setStatusText('Analyzing...');

        const feedback = await ai.feedback(
           uploadFile.path,
           prepareInstructions({jobTitle , jobDescription})
        )

        if(!feedback){
           setStatusText('Error : Failed to analyze resume');
           return 
        }

        const feedbackText = typeof feedback.message.content === 'string'
            ? feedback.message.content
            : feedback.message.content[0].text;

        data.feedback = JSON.parse(feedbackText);

        
        
        
        await kv.set(`resume:${uuid}` , JSON.stringify(data));
        setStatusText('Analysis complete , redirecting....');
        console.log(data);
        navigate(`/resumes/${uuid}`);

    }
    catch (err) {
    console.error(err);
    setStatusText(`Error: ${err?.message || err}`);
  } finally {
    setIsProcessing(false);
  }
};


    

    const handleSubmit = (e) => {
    e.preventDefault();

  

   

    const form = e.currentTarget.closest('form');
    if(!form) return;

    const formData = new FormData(form);
    if (file) {
      formData.append("resume", file);
    }

    const companyName = formData.get('company-name');
    const jobTitle = formData.get('job-title');
    const jobDescription = formData.get('job-description');

    if(!file) return;

    handleAnalyze({companyName , jobTitle , jobDescription , file});
    

   
  };
  return (
    <main className="bg-[url('https://img.freepik.com/premium-vector/soft-pink-gradient-background-pastel-colors-pink-liquid-dynamic-shapes-abstract-composition_293525-1092.jpg')] bg-cover">
        <Navbar/>
    
          <section className="main-section">
          <div className='page-heading py-16'>
            <h1>
                Smart feedback for your dream job
            </h1>
            {isProcessing ? (<>

                <h2>{statusText}</h2>
                <img src="/images/resume-scan.gif" className='w-full'/>
            
            </>):(
                <h2>Drop your resume for an ATS score and improvement tips </h2>
            )} 
            {!isProcessing && (
                <form id="upload-form" onSubmit={handleSubmit} className='flex flex-col gap-4'>
                  <div className='form-div'>
                    <label htmlFor="company-name">Company Name</label>
                    <input type="text" name="company-name" placeholder='Company Name' id="company-name"/>
                  </div>
                   <div className='form-div'>
                    <label htmlFor="job-title">Job Title</label>
                    <input type="text" name="job-title" placeholder='Job Title' id="job-title"/>
                  </div>
                  <div className='form-div'>
                    <label htmlFor="job-description">Job description</label>
                    <textarea rows={5} name="job-description" placeholder='Job description' id="job-description"/>
                  </div>

                  <div className='form-div'>
                    <label htmlFor="uploader">Upload Resume</label>
                    <FileUploader file={file} onFileSelect={handleFileSelect} onRemove={handleRemove} />
              
                  </div>

                  <button className='primary-button' type="submit">Analyze Resume</button>

                </form>
            )}
          </div>
          </section>
    </main>
  )
}

export default Upload  