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
    public class EditModel : PageModel
    {
        private readonly SAG2.Data.ApplicationDbContext _context;

        public EditModel(SAG2.Data.ApplicationDbContext context)
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
            ViewData["UserId"] = new SelectList(_context.Users, "Id", "Id");
            return Page();
        }

        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        public async Task<IActionResult> OnPostAsync()
        {
            if (!ModelState.IsValid)
            {
                return Page();
            }

            _context.Attach(Sword).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SwordExists(Sword.ID))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return RedirectToPage("./Index");
        }

        private bool SwordExists(int id)
        {
            return _context.Sword.Any(e => e.ID == id);
        }
    }
}
