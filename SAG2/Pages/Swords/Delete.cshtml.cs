using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using SAG2.Data;
using SAG2.Models;

namespace SAG2.Pages.Swords
{
    [Authorize]
    public class DeleteModel : PageModel
    {
        private readonly SAG2.Data.ApplicationDbContext _context;

        public DeleteModel(SAG2.Data.ApplicationDbContext context)
        {
            _context = context;
        }

        [BindProperty]
        public Sword Sword { get; set; }

        public async Task<IActionResult> OnGetAsync(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            Sword = await _context.Sword
                .Include(s => s.User).FirstOrDefaultAsync(m => m.ID == id);

            if (Sword == null)
            {
                return NotFound();
            }
            return Page();
        }

        public async Task<IActionResult> OnPostAsync(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            Sword = await _context.Sword.FindAsync(id);

            if (Sword != null)
            {
                _context.Sword.Remove(Sword);
                await _context.SaveChangesAsync();
            }

            return RedirectToPage("./Index");
        }
    }
}
