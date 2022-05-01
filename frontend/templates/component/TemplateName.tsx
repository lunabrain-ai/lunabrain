import React from 'react'
import './TemplateName.scss'

interface TemplateNameProps {

}

export const TemplateName: React.FunctionComponent<TemplateNameProps> = (props) => {
  const {} = props;
  return (
    <div className="TemplateName" data-testid="TemplateName">
      TemplateName Component
    </div>
  );
}
