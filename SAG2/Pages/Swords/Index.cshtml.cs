using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using SAG2.Data;
using SAG2.Models;

namespace SAG2.Pages.Swords
{
    [Authorize]
    public class IndexModel : PageModel
    {
        private readonly SAG2.Data.ApplicationDbContext _context;

        public IndexModel(SAG2.Data.ApplicationDbContext context)
        {
            _context = context;
        }

        [BindProperty(SupportsGet = true)]
        public string SearchString { get; set; }
        public IList<Sword> Swords { get; set; }

        public async Task OnGetAsync()
        {
            IQueryable<Sword> swords = from m in _context.Sword
                                       select m;

            if (!string.IsNullOrEmpty(User.Identity.Name))
            {
                swords = swords.Where(x => x.User.UserName == User.Identity.Name);
            }

            if (!string.IsNullOrEmpty(SearchString))
            {
                swords = swords.Where(s => s.Name.Contains(SearchString));
            }

            Swords = await swords.ToListAsync();
        }
    }
}
