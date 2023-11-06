import React from 'react'
import "./post.scss";

const post=()=>{
    return(

<div className='post'>
           {/* <div className='Avatar_symbol'>
            <Avatar/>
          </div>  */}
          <div className='text_body'>
            <div className='text_header'>
              <div className='text_name'>
                <h3>John Doe </h3>
                <h3>@JohnDoe</h3>
              </div>
              <div className='text_description'>
                 <p>Here is where all the text is going to go etc etc etc etc etc</p>
              </div>
            </div>
            <div className="text_bottom">

            </div>
          </div>
        </div>
    )

}

export default post