import re
import requests
from bs4 import BeautifulSoup
from typing import Optional


class MallaScraper:
    BASE_URL = "https://www.utp.edu.pe"

    HEADERS = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "es-PE,es;q=0.9,en;q=0.8",
    }

    def fetch(self, url: str) -> Optional[BeautifulSoup]:
        try:
            resp = requests.get(url, headers=self.HEADERS, timeout=15)
            resp.raise_for_status()
            return BeautifulSoup(resp.text, "lxml")
        except requests.RequestException:
            return None

    def scrape(self, url: str) -> Optional[dict]:
        soup = self.fetch(url)
        if not soup:
            return None

        section = soup.find("section", id="malla-curricular")
        if not section:
            return None

        if section.get("class") and "landing-mallas" in section.get("class", []):
            return self._parse_template_a(section)
        return self._parse_template_b(section)

    def _parse_template_a(self, section: BeautifulSoup) -> dict:
        title_el = section.select_one(".field-name-header h1")
        career_name = title_el.get_text(strip=True) if title_el else ""
        career_name = re.sub(r"^Malla Curricular de:\s*", "", career_name)

        cycles = []
        for row in section.select(".views-row"):
            idx_el = row.select_one(".loop-index")
            cycle_num = int(idx_el.get_text(strip=True)) if idx_el else 0

            courses = [li.get_text(strip=True) for li in row.select("ul li")]
            if courses:
                cycles.append({"cycle": cycle_num, "courses": courses})

        pdf_link = None
        pdf_el = section.select_one('.field-name-enlaces a[href$=".pdf"]')
        if pdf_el:
            href = pdf_el.get("href", "")
            pdf_link = href if href.startswith("http") else self.BASE_URL + href

        return {
            "career": career_name,
            "total_cycles": len(cycles),
            "cycles": cycles,
            "pdf_url": pdf_link,
            "template": "A",
        }

    def _parse_template_b(self, section: BeautifulSoup) -> dict:
        title_el = section.select_one(".field-name-title h2")
        career_name = title_el.get_text(strip=True) if title_el else ""
        career_name = re.sub(r"^Malla curricular\s*(de:?\s*)?", "", career_name)

        cycles = []
        for slide in section.select(".swiper-slide"):
            ciclo_el = slide.select_one(".field-name-ciclo")
            if not ciclo_el:
                continue

            ciclo_text = ciclo_el.get_text(strip=True)
            match = re.search(r"(\d+)", ciclo_text)
            cycle_num = int(match.group(1)) if match else 0

            courses = [
                li.get_text(strip=True)
                for li in slide.select(".field-name-descripcion ul li")
            ]
            if courses:
                cycles.append({"cycle": cycle_num, "courses": courses})

        pdf_link = None
        pdf_el = section.select_one('.swiper-enlaces a[href$=".pdf"]')
        if pdf_el:
            href = pdf_el.get("href", "")
            pdf_link = href if href.startswith("http") else self.BASE_URL + href

        return {
            "career": career_name,
            "total_cycles": len(cycles),
            "cycles": cycles,
            "pdf_url": pdf_link,
            "template": "B",
        }
