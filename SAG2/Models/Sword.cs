using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace SAG2.Models
{
    public class Sword
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public string Mass { get; set; }
        public string GripReference { get; set; }
        public string CenterOfMass { get; set; }
        public string LeverReference { get; set; }
        public string HiltNode { get; set; }
        public string BladeNode { get; set; }
        public string ActionPoint1 { get; set; }
        public string PivotPoint1 { get; set; }
        public string ActionPoint2 { get; set; }
        public string PivotPoint2 { get; set; }
        public string OverallLength { get; set; }
        public string Style { get; set; }
        [ForeignKey("UserId")]
        public IdentityUser User { get; set; }
        public string UserId { get; set; }
    }
}
