using System;
using EPiServer;
using EPiServer.Core;
using System.Text;
using EPiServer.Filters;

namespace netr
{
    public partial class GetPages : System.Web.UI.Page
    {
        public string Output;

        protected void Page_Load(object sender, EventArgs e)
        {
            StringBuilder sb = new StringBuilder();
            PropertyCriteriaCollection propertyCriteriaCollection = new PropertyCriteriaCollection() {
                new PropertyCriteria() {
                    Name = "PageName",
                    Condition = CompareCondition.Contained,
                    Required = true,
                    Type = PropertyDataType.String,
                    Value = Request.Params["searchword"]
                }
            };

            PageDataCollection pageDataCollection = DataFactory.Instance.FindPagesWithCriteria(PageReference.StartPage, propertyCriteriaCollection);
            foreach (PageData pageData in pageDataCollection)
            {
                sb.Append("<option value='" + pageData.StaticLinkURL + "'>" + pageData.PageName + "</option>");
            }
            Output = sb.ToString();
        }
    }
}