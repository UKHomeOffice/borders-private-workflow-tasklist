import React from 'react';
import PropTypes from 'prop-types';

const TaskPagination = ({paginationActions}) => {
 const {onFirst, onPrev, onNext, onLast} = paginationActions;
 return  (
   <div className="govuk-grid-row text-center">
     <div className="govuk-grid-column-full">
       <button type="submit" className="govuk-button govuk-!-margin-right-2" onClick={onFirst} disabled={!onFirst}><span aria-hidden="true" role="presentation">&laquo;</span> First</button>
       <button type="submit" className="govuk-button govuk-!-margin-right-2" onClick={onPrev} disabled={!onPrev}><span aria-hidden="true" role="presentation">&lsaquo;</span> Previous</button>
       <button type="submit" className="govuk-button govuk-!-margin-right-2" onClick={onNext} disabled={!onNext}>Next <span aria-hidden="true" role="presentation">&rsaquo;</span></button>
       <button type="submit" className="govuk-button govuk-!-margin-right-2" onClick={onLast} disabled={!onLast}>Last <span aria-hidden="true" role="presentation">&raquo;</span></button>
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
