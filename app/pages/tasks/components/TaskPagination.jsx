import React from 'react';
import PropTypes from 'prop-types';

const TaskPagination = ({paginationActions}) => {
 const {onFirst, onPrev, onNext, onLast} = paginationActions;
 return  (
   <div className="govuk-grid-row govuk-!-margin-top-2">
     <div className="govuk-grid-column-full">
       <div className="govuk-grid-row">
         <div className="govuk-grid-column-one-quarter">
           <button type="submit" data-module="govuk-button" className={`govuk-button govuk-!-width-full ${!onFirst ? 'govuk-button--disabled' : ''}`} onClick={onFirst} disabled={!onFirst}><span aria-hidden="true" role="presentation">&laquo;</span> First</button>
         </div>
         <div className="govuk-grid-column-one-quarter">
           <button type="submit" data-module="govuk-button" className={`govuk-button govuk-!-width-full ${!onPrev ? 'govuk-button--disabled' : ''}`} onClick={onPrev} disabled={!onPrev}><span aria-hidden="true" role="presentation">&lsaquo;</span> Previous</button>
         </div>
         <div className="govuk-grid-column-one-quarter">
           <button type="submit" data-module="govuk-button" className={`govuk-button govuk-!-width-full ${!onNext ? 'govuk-button--disabled' : ''}`} onClick={onNext} disabled={!onNext}>Next <span aria-hidden="true" role="presentation">&rsaquo;</span></button>
         </div>
         <div className="govuk-grid-column-one-quarter">
           <button type="submit" data-module="govuk-button" className={`govuk-button govuk-!-width-full ${!onLast ? 'govuk-button--disabled' : ''}`} onClick={onLast} disabled={!onLast}>Last <span aria-hidden="true" role="presentation">&raquo;</span></button>
         </div>
       </div>
     </div>
   </div>
)
};

TaskPagination.defaultProps = {
    paginationActions: {
        onFirst: null,
        onPrev: null,
        onNext: null,
        onLast: null
    }
};

TaskPagination.propTypes = {
   paginationActions: PropTypes.shape({
       onFirst: PropTypes.func,
       onPrev: PropTypes.func,
       onNext: PropTypes.func,
       onLast: PropTypes.func
   })
};


export default TaskPagination;
